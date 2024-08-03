import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { EnrollStudent, IfindEnrollmentsProps } from "./interfaces";
import * as yup from "yup";
import sendEmail from "src/utils/mailTransporter";
const statusOptions = [
  "todos",
  "matriculado",
  "orientador_definido",
  "banca_preenchida",
  "banca_agendada",
  "aprovado",
  "reprovado",
  "nao_finalizado",
];
@Injectable()
export class TCC1Service {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async findEnrollmentsByIdSemester({
    idSemester,
    term,
    status,
  }: IfindEnrollmentsProps) {
    const schema = yup.object().shape({
      idSemester: yup.number().required(),
      term: yup.string().notRequired(),
      status: yup.mixed().oneOf(statusOptions).notRequired(),
    });

    try {
      await schema.validate({
        idSemester,
        term,
        status,
      });
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const enrollmentsWithStudents = await this.prisma.alunoMatriculado.findMany(
      {
        where: {
          idSemestre: idSemester,
          status: !status || status === "todos" ? undefined : status,
          OR: term
            ? [
                {
                  Aluno: {
                    nome: {
                      contains: term,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  Aluno: {
                    ra: {
                      contains: term,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  Aluno: {
                    email: {
                      contains: term,
                      mode: "insensitive",
                    },
                  },
                },
              ]
            : undefined,
        },
        include: {
          Aluno: true,
          Orientador: true,
          Coorientador: true,
        },
      },
    );

    return enrollmentsWithStudents;
  }

  async enroll(student: EnrollStudent) {
    try {
      const enrollSchema = yup.object().shape({
        ra: yup.string().required(),
        nome: yup.string().required(),
        email: yup.string().email().required(),
      });
      await enrollSchema.validate(student);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const activeSemester = await this.prisma.semestre.findFirst({
      where: {
        ativo: true,
      },
    });

    if (!activeSemester) {
      throw {
        statusCode: 400,
        message: "Não existe um semestre ativo",
      };
    }

    const alreadyEnrolled = await this.prisma.alunoMatriculado.findFirst({
      where: {
        raAluno: student.ra,
        idSemestre: activeSemester.id,
        etapa: "TCC1",
      },
    });

    if (alreadyEnrolled) {
      throw {
        statusCode: 400,
        message: `Já existe um aluno com este RA matriculado em TCC1 no semestre ${activeSemester.ano}/${activeSemester.numero}`,
      };
    }

    const registeredStudent = await this.prisma.aluno.findFirst({
      where: {
        ra: student.ra,
      },
    });

    if (!registeredStudent) {
      const createdStudent = await this.prisma.aluno.create({
        data: {
          ra: student.ra,
          nome: student.nome,
          email: student.email,
        },
      });

      if (!createdStudent) {
        throw {
          statusCode: 500,
          message: "Erro ao cadastrar aluno",
        };
      }
    }

    if (
      registeredStudent &&
      (registeredStudent.email !== student.email ||
        registeredStudent.nome !== student.nome)
    ) {
      const updatedStudent = await this.prisma.aluno.update({
        where: {
          ra: student.ra,
        },
        data: {
          email: student.email,
          nome: student.nome,
        },
      });

      if (!updatedStudent) {
        throw {
          statusCode: 500,
          message: "Erro ao atualizar email do aluno",
        };
      }
    }

    // Inicia uma transação
    const transaction = await this.prisma.$transaction(async (prisma) => {
      const createdEnrollment = await prisma.alunoMatriculado.create({
        data: {
          raAluno: student.ra,
          idSemestre: activeSemester.id,
          etapa: "TCC1",
          status: "matriculado",
        },
      });

      if (!createdEnrollment) {
        throw {
          statusCode: 500,
          message: "Erro ao matricular aluno",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: student.ra,
          idSemestre: activeSemester.id,
          etapa: "TCC1",
          status: "matriculado",
          observacao: "Aluno matriculado",
        },
      });

      if (!createHistory) {
        throw {
          statusCode: 500,
          message: "Erro ao criar histórico",
        };
      }

      return createdEnrollment;
    });

    return transaction;
  }

  async enrollBatch(students: EnrollStudent[]) {
    // Verifica se students é um array
    if (!Array.isArray(students)) {
      throw {
        statusCode: 400,
        message: "O corpo da requisição deve ser um array de alunos",
      };
    }

    const enrollSchema = yup.object().shape({
      ra: yup.string().required(),
      nome: yup.string().required(),
      email: yup.string().email().required(),
    });

    const activeSemester = await this.prisma.semestre.findFirst({
      where: {
        ativo: true,
      },
    });

    if (!activeSemester) {
      throw {
        statusCode: 400,
        message: "Não existe um semestre ativo",
      };
    }

    // Inicia uma transação
    const transaction = await this.prisma.$transaction(async (prisma) => {
      const results = [];

      for (const student of students) {
        try {
          // Validação do estudante
          await enrollSchema.validate(student);

          // Verifica se o aluno já está matriculado
          const alreadyEnrolled = await prisma.alunoMatriculado.findFirst({
            where: {
              raAluno: student.ra,
              idSemestre: activeSemester.id,
              etapa: "TCC1",
            },
          });

          if (alreadyEnrolled) {
            throw {
              statusCode: 422,
              message: `O aluno ${student.nome} (RA: ${student.ra}) já foi matriculado em TCC1 no semestre ${activeSemester.ano}/${activeSemester.numero}`,
            };
          }

          // Verifica se o aluno já está cadastrado
          const registeredStudent = await prisma.aluno.findFirst({
            where: {
              ra: student.ra,
            },
          });

          // Se o aluno não estiver cadastrado, cadastra o aluno
          if (!registeredStudent) {
            const createdStudent = await prisma.aluno.create({
              data: {
                ra: student.ra,
                nome: student.nome,
                email: student.email,
              },
            });

            if (!createdStudent) {
              throw {
                statusCode: 500,
                message: `Falha interna ao cadastrar aluno ${student.nome} (RA: ${student.ra})`,
              };
            }
          }

          if (
            registeredStudent &&
            (registeredStudent.email !== student.email ||
              registeredStudent.nome !== student.nome)
          ) {
            const updatedStudent = await prisma.aluno.update({
              where: {
                ra: student.ra,
              },
              data: {
                email: student.email,
              },
            });

            if (!updatedStudent) {
              throw {
                statusCode: 500,
                message: "Erro ao atualizar email do aluno",
              };
            }
          }

          // Matricula o aluno
          const createdEnrollment = await prisma.alunoMatriculado.create({
            data: {
              raAluno: student.ra,
              idSemestre: activeSemester.id,
              etapa: "TCC1",
              status: "matriculado",
            },
          });

          if (!createdEnrollment) {
            throw {
              statusCode: 500,
              message: `Erro ao matricular aluno ${student.nome} RA:${student.ra}`,
            };
          }

          const createHistory = await prisma.historicoAluno.create({
            data: {
              raAluno: student.ra,
              idSemestre: activeSemester.id,
              etapa: "TCC1",
              status: "matriculado",
              observacao: "Aluno matriculado em lote",
            },
          });

          if (!createHistory) {
            throw {
              statusCode: 500,
              message: "Erro ao criar histórico",
            };
          }

          results.push({
            ...createdEnrollment,
          });
        } catch (error) {
          throw {
            statusCode: error.statusCode || 500,
            message: error.message || "Erro desconhecido",
          };
        }
      }
      return results;
    });

    return transaction;
  }

  async unenroll(idStudent: number) {
    if (!idStudent) {
      throw {
        statusCode: 400,
        message: "ID do aluno matriculado não foi informado",
      };
    }
    const existingAlunoMatriculado =
      await this.prisma.alunoMatriculado.findFirst({
        where: {
          id: idStudent,
        },
      });

    if (!existingAlunoMatriculado) {
      throw {
        statusCode: 404,
        message: `Aluno não encontrado`,
      };
    }

    const deletedEnrollment = await this.prisma.alunoMatriculado.delete({
      where: {
        id: idStudent,
      },
    });

    if (!deletedEnrollment) {
      throw {
        statusCode: 500,
        message: "Erro ao desmatricular aluno",
      };
    }

    const createHistory = await this.prisma.historicoAluno.create({
      data: {
        raAluno: existingAlunoMatriculado.raAluno,
        idSemestre: existingAlunoMatriculado.idSemestre,
        etapa: "TCC1",
        status: "desmatriculado",
        observacao: "Aluno desmatriculado",
      },
    });

    if (!createHistory) {
      throw {
        statusCode: 500,
        message: "Erro ao criar histórico",
      };
    }

    return deletedEnrollment;
  }

  async finishSemester(semesterId: number) {
    if (!semesterId) {
      throw {
        statusCode: 400,
        message: "ID do semestre não foi informado",
      };
    }

    const existingSemester = await this.prisma.semestre.findFirst({
      where: {
        id: semesterId,
      },
    });

    if (!existingSemester) {
      throw {
        statusCode: 404,
        message: `Semestre não encontrado`,
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedEnrollments = await prisma.alunoMatriculado.updateMany({
        where: {
          idSemestre: semesterId,
          etapa: "TCC1",
          OR: [
            {
              status: {
                not: "aprovado",
              },
            },
            {
              status: {
                not: "reprovado",
              },
            },
          ],
        },
        data: {
          status: "nao_finalizado",
        },
      });

      if (!updatedEnrollments) {
        throw {
          statusCode: 500,
          message: "Erro ao finalizar semestre",
        };
      }

      const enrollments = await prisma.alunoMatriculado.findMany({
        where: {
          idSemestre: semesterId,
          etapa: "TCC1",
        },
      });

      if (!enrollments) {
        throw {
          statusCode: 500,
          message: "Erro ao buscar matrículas",
        };
      }

      for (const enrollment of enrollments) {
        const createHistory = await prisma.historicoAluno.create({
          data: {
            raAluno: enrollment.raAluno,
            idSemestre: semesterId,
            etapa: "TCC1",
            status: "nao_finalizado",
            observacao: "Semestre finalizado",
          },
        });

        if (!createHistory) {
          throw {
            statusCode: 500,
            message: "Erro ao criar histórico",
          };
        }
      }
    });

    return transaction;
  }

  async importEnrollmentsFromSemester(semesterId: number) {
    if (!semesterId) {
      throw {
        statusCode: 400,
        message: "ID do semestre não foi informado",
      };
    }

    const existingSemester = await this.prisma.semestre.findFirst({
      where: {
        id: semesterId,
      },
    });

    if (!existingSemester) {
      throw {
        statusCode: 404,
        message: `Semestre não encontrado`,
      };
    }

    const activeSemester = await this.prisma.semestre.findFirst({
      where: {
        ativo: true,
      },
    });

    if (!activeSemester) {
      throw {
        statusCode: 400,
        message: "Não existe um semestre ativo",
      };
    }

    if (activeSemester.id === semesterId) {
      throw {
        statusCode: 400,
        message: "Não é possível importar matrículas do semestre ativo",
      };
    }

    const enrollments = await this.prisma.alunoMatriculado.findMany({
      where: {
        idSemestre: semesterId,
        etapa: "TCC1",
        OR: [
          {
            status: "nao_finalizado",
          },
          {
            status: "reprovado",
          },
        ],
      },
    });

    const activeEnrollments = await this.prisma.alunoMatriculado.findMany({
      where: {
        idSemestre: activeSemester.id,
        etapa: "TCC1",
      },
    });

    if (!enrollments || !activeEnrollments) {
      throw {
        statusCode: 500,
        message: `Falha ao buscar matrículas do semestre ${existingSemester.ano}/${existingSemester.numero}`,
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      for (const enrollment of enrollments) {
        const alreadyEnrolled = activeEnrollments.find(
          (activeEnrollment) => activeEnrollment.raAluno === enrollment.raAluno,
        );

        if (alreadyEnrolled) return;

        const createdEnrollment = await prisma.alunoMatriculado.create({
          data: {
            raAluno: enrollment.raAluno,
            idSemestre: activeSemester.id,
            etapa: "TCC1",
            status: "matriculado",
          },
        });

        if (!createdEnrollment) {
          throw {
            statusCode: 500,
            message: "Erro ao matricular aluno",
          };
        }

        const createHistory = await prisma.historicoAluno.create({
          data: {
            raAluno: enrollment.raAluno,
            idSemestre: activeSemester.id,
            etapa: "TCC1",
            status: "matriculado",
            observacao: `Matrícula importada do semestre ${existingSemester.ano}/${existingSemester.numero}`,
          },
        });

        if (!createHistory) {
          throw {
            statusCode: 500,
            message: "Erro ao criar histórico",
          };
        }
      }
    });

    return transaction;
  }

  async adminDefineAdvisor({ enrollmentId, advisorId, coAdvisorId, admin }) {
    const adminName = admin?.nome;
    const adminEmail = admin?.email;
    const systemEmail = admin?.emailSistema;
    const systemEmailKey = admin?.chaveEmailSistema;

    const schema = yup.object().shape({
      enrollmentId: yup.number().required(),
      advisorId: yup.number().required(),
      coAdvisorId: yup.number().notRequired(),
      systemEmail: yup.string().email().required(),
      systemEmailKey: yup.string().required(),
    });

    try {
      await schema.validate({
        enrollmentId,
        advisorId,
        coAdvisorId,
        systemEmail: systemEmail,
        systemEmailKey: systemEmailKey,
      });
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const enrollment = await this.prisma.alunoMatriculado.findFirst({
      where: {
        id: enrollmentId,
      },
    });

    if (!enrollment) {
      throw {
        statusCode: 404,
        message: "Matrícula não encontrada",
      };
    }

    if (enrollment.status !== "matriculado") {
      throw {
        statusCode: 400,
        message: "O status do aluno não permite a definição de orientador",
      };
    }

    const advisor = await this.prisma.professor.findFirst({
      where: {
        id: advisorId,
        ativo: true,
      },
    });

    if (!advisor) {
      throw {
        statusCode: 404,
        message: "Orientador não encontrado",
      };
    }

    const coAdvisor = coAdvisorId
      ? await this.prisma.professor.findFirst({
          where: {
            id: coAdvisorId,
          },
        })
      : null;

    if (coAdvisorId && !coAdvisor) {
      throw {
        statusCode: 404,
        message: "Coorientador não encontrado",
      };
    }

    const activeSemester = await this.prisma.semestre.findFirst({
      where: {
        ativo: true,
      },
    });

    if (!activeSemester) {
      throw {
        statusCode: 400,
        message: "Não existe um semestre ativo",
      };
    }

    if (enrollment.idSemestre !== activeSemester.id) {
      throw {
        statusCode: 400,
        message: "A matrícula não pertence ao semestre ativo",
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedEnrollment = await prisma.alunoMatriculado.update({
        where: {
          id: enrollmentId,
        },
        data: {
          idOrientador: advisorId,
          idCoorientador: coAdvisorId,
          status: "orientador_definido",
        },
        include: {
          Aluno: true,
        },
      });

      if (!updatedEnrollment) {
        throw {
          statusCode: 500,
          message: "Erro ao definir orientador",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: updatedEnrollment.raAluno,
          idSemestre: activeSemester.id,
          etapa: "TCC1",
          status: "orientador_definido",
          observacao:
            `Definição Orientador por administrador\n` +
            `Orientador: ${advisor.nome}\n` +
            `Coorientador: ${coAdvisor ? coAdvisor.nome : "Não definido"}`,
        },
      });

      if (!createHistory) {
        throw {
          statusCode: 500,
          message: "Erro ao criar histórico",
        };
      }

      const response = await sendEmail({
        user: systemEmail,
        pass: systemEmailKey,
        from: `${adminName} <${adminEmail}>`,
        to: advisor.email,
        subject: "Orientador TCC1 definido",
        text:
          `Olá, ${advisor.nome}!\n\n` +
          `Você foi definido como orientador do aluno ${updatedEnrollment.Aluno.nome} (RA: ${updatedEnrollment.Aluno.ra})\n\n` +
          `Para mais informações, entre em contato com o PRATCC (${admin.nome} - ${admin.email}) \n\n`,
      });
      if (response.status === "error") {
        throw {
          statusCode: 500,
          message: "Erro ao enviar email para orientador",
        };
      }
    });

    return transaction;
  }
}
