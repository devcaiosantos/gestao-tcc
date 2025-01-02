import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { EnrollStudent, IfindEnrollmentsProps } from "./interfaces";
import * as yup from "yup";
import sendEmail from "src/utils/mailTransporter";
import { createEvent } from "src/service/calendarAPI/createEvent";
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
          Banca: {
            include: {
              membros: true,
            },
          },
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
      },
    });

    if (alreadyEnrolled) {
      throw {
        statusCode: 400,
        message: `Já existe um aluno com este RA matriculado em ${alreadyEnrolled.etapa} no semestre ${activeSemester.ano}/${activeSemester.numero}`,
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
            },
          });

          if (alreadyEnrolled) {
            throw {
              statusCode: 422,
              message: `O aluno ${student.nome} (RA: ${student.ra}) já foi matriculado em ${alreadyEnrolled.etapa} no semestre ${activeSemester.ano}/${activeSemester.numero}`,
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
        include: {
          Banca: true,
        },
      });

    if (!existingAlunoMatriculado) {
      throw {
        statusCode: 404,
        message: `Aluno não encontrado`,
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      if (existingAlunoMatriculado.Banca) {
        const deletedBoardMembers = await prisma.bancaMembro.deleteMany({
          where: {
            bancaId: existingAlunoMatriculado.Banca.id,
          },
        });

        const deletedBoard = await prisma.banca.delete({
          where: {
            id: existingAlunoMatriculado.Banca.id,
          },
        });

        if (!deletedBoard || !deletedBoardMembers) {
          throw {
            statusCode: 500,
            message: "Erro ao excluir banca",
          };
        }
      }

      const deletedEnrollment = await prisma.alunoMatriculado.delete({
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

      const createHistory = await prisma.historicoAluno.create({
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
    });
    return transaction;
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

  async studentDefineAdvisor({ advisorId, coAdvisorId, studentToken }) {
    const schema = yup.object().shape({
      advisorId: yup.number().required(),
      coAdvisorId: yup.number(),
      studentToken: yup.string().required(),
    });
    try {
      await schema.validate({
        advisorId,
        coAdvisorId,
        studentToken: studentToken,
      });
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }
    const payload = await this.jwtService
      .verifyAsync(studentToken, {
        secret: process.env.STUDENT_JWT_SECRET,
      })
      .then((payload) => payload)
      .catch((err) => {
        throw {
          statusCode: 401,
          message: "[1] Token inválido " + err,
        };
      });

    const enrollmentId = payload.id;
    const adminId = payload.adminId;
    const status = payload.status;

    if (status != "definir-orientador") {
      throw {
        statusCode: 401,
        message: "[2] Token Inválido",
      };
    }

    const enrollment = await this.prisma.alunoMatriculado.findFirst({
      where: {
        id: enrollmentId,
      },
      include: {
        Semestre: true,
      },
    });

    if (
      !enrollment ||
      enrollment.status !== "matriculado" ||
      !enrollment.Semestre.ativo
    ) {
      throw {
        statusCode: 400,
        message: "Matrícula inválida",
      };
    }

    const admin = await this.prisma.administrador.findFirst({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
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
        message: "Orientador inválido",
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
        message: "Coorientador inválido",
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
          idSemestre: enrollment.Semestre.id,
          etapa: "TCC1",
          status: "orientador_definido",
          observacao:
            `Definição Orientador por aluno\n` +
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
        user: admin.emailSistema,
        pass: admin.chaveEmailSistema,
        from: `${admin.nome} <${admin.emailSistema}>`,
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

  async removeAdvisor({
    enrollmentId,
    adminName,
  }: {
    enrollmentId: number;
    adminName: string;
  }) {
    if (!enrollmentId) {
      throw {
        statusCode: 400,
        message: "ID da matrícula não foi informado",
      };
    }

    const enrollment = await this.prisma.alunoMatriculado.findFirst({
      where: {
        id: enrollmentId,
      },
      include: {
        Semestre: true,
        Aluno: true,
        Orientador: true,
        Coorientador: true,
      },
    });

    if (!enrollment) {
      throw {
        statusCode: 404,
        message: "Matrícula não encontrada",
      };
    }

    if (enrollment.status !== "orientador_definido") {
      throw {
        statusCode: 400,
        message: "O status do aluno não permite a remoção de orientador",
      };
    }

    const semester = await this.prisma.semestre.findFirst({
      where: {
        id: enrollment.idSemestre,
      },
    });

    if (!semester || !semester.ativo) {
      throw {
        statusCode: 500,
        message: "Semestre não encontrado ou não ativo",
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedEnrollment = await prisma.alunoMatriculado.update({
        where: {
          id: enrollmentId,
        },
        data: {
          idOrientador: null,
          idCoorientador: null,
          status: "matriculado",
        },
      });

      if (!updatedEnrollment) {
        throw {
          statusCode: 500,
          message: "Erro ao remover orientador",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: updatedEnrollment.raAluno,
          idSemestre: semester.id,
          etapa: "TCC1",
          status: "matriculado",
          observacao: `Orientador/Coorientador removidos por administrador ${adminName}`,
        },
      });

      if (!createHistory) {
        throw {
          statusCode: 500,
          message: "Erro ao criar histórico",
        };
      }
    });

    return transaction;
  }

  async adminDefineBoard({ enrollmentId, membersIds, admin }) {
    const adminName = admin?.nome;
    const adminEmail = admin?.email;
    const systemEmail = admin?.emailSistema;
    const systemEmailKey = admin?.chaveEmailSistema;

    const schema = yup.object().shape({
      enrollmentId: yup.number().required(),
      membersIds: yup
        .array()
        .of(yup.number())
        .min(3)
        .required("idMembros é um campo obrigatório"),
      systemEmail: yup.string().email().required(),
      systemEmailKey: yup.string().required(),
    });

    try {
      await schema.validate({
        enrollmentId,
        membersIds,
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
      include: {
        Aluno: true,
      },
    });

    if (!enrollment) {
      throw {
        statusCode: 404,
        message: "Matrícula não encontrada",
      };
    }

    if (enrollment.status !== "orientador_definido") {
      throw {
        statusCode: 400,
        message: "O status do aluno não permite a definição de banca",
      };
    }

    const members = await this.prisma.professor.findMany({
      where: {
        id: {
          in: membersIds,
        },
        ativo: true,
      },
    });

    if (members.length !== membersIds.length) {
      throw {
        statusCode: 404,
        message: "Membro da banca não encontrado",
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
          status: "banca_preenchida",
        },
        include: {
          Aluno: true,
        },
      });

      const createdBoard = await prisma.banca.create({
        data: {
          idAlunoMatriculado: enrollmentId,
        },
      });

      if (!createdBoard) {
        throw {
          statusCode: 500,
          message: "Erro ao definir banca",
        };
      }

      const createBoardMembers = await prisma.bancaMembro.createMany({
        data: members.map((member) => ({
          bancaId: createdBoard.id,
          professorId: member.id,
          isPresidente: member.id === membersIds[0],
        })),
      });

      if (!createBoardMembers) {
        throw {
          statusCode: 500,
          message: "Erro ao definir membros da banca",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: updatedEnrollment.raAluno,
          idSemestre: activeSemester.id,
          etapa: "TCC1",
          status: "banca_preenchida",
          observacao:
            `Definição Banca por administrador\n` +
            `Banca: ${members.map((member) => member.nome).join(", ")}`,
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
        to: members.map((member) => member.email).join(", "),
        subject: `Banca TCC1 definida - ${updatedEnrollment.Aluno.nome}`,
        text:
          `Olá!\n\n` +
          `Você foi definido como membro da banca do aluno ${updatedEnrollment.Aluno.nome} (RA: ${updatedEnrollment.Aluno.ra})\n\n` +
          `Para mais informações, entre em contato com o PRATCC (${adminName} - ${adminEmail}) \n\n`,
      });
      if (response.status === "error") {
        throw {
          statusCode: 500,
          message: "Erro ao enviar email para membros da banca",
        };
      }
    });

    return transaction;
  }

  async adminUpdateBoard({ enrollmentId, membersIds, admin }) {
    const adminName = admin?.nome;
    const adminEmail = admin?.email;
    const systemEmail = admin?.emailSistema;
    const systemEmailKey = admin?.chaveEmailSistema;

    const schema = yup.object().shape({
      enrollmentId: yup.number().required(),
      membersIds: yup
        .array()
        .of(yup.number())
        .min(3)
        .required("idMembros é um campo obrigatório"),
      systemEmail: yup.string().email().required(),
      systemEmailKey: yup.string().required(),
    });

    try {
      await schema.validate({
        enrollmentId,
        membersIds,
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
      include: {
        Aluno: true,
        Banca: {
          include: {
            membros: true,
          },
        },
        Semestre: true,
      },
    });

    if (!enrollment) {
      throw {
        statusCode: 404,
        message: "Matrícula não encontrada",
      };
    }

    if (enrollment.status !== "banca_preenchida") {
      throw {
        statusCode: 400,
        message: "O status do aluno não permite a atualização da banca",
      };
    }

    if (!enrollment.Banca.id) {
      throw {
        statusCode: 404,
        message: "Banca não encontrada",
      };
    }

    if (!enrollment.Semestre.ativo) {
      throw {
        statusCode: 404,
        message: "Semestre não ativo",
      };
    }

    const members = await this.prisma.professor.findMany({
      where: {
        id: {
          in: membersIds,
        },
        ativo: true,
      },
    });

    if (members.length !== membersIds.length) {
      throw {
        statusCode: 404,
        message: "Membro da banca não encontrado",
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedBoard = await prisma.banca.update({
        where: {
          id: enrollment.Banca.id,
        },
        data: {
          membros: {
            deleteMany: {},
            createMany: {
              data: membersIds.map((memberId, i) => ({
                isPresidente: i === 0,
                professorId: memberId,
              })),
            },
          },
        },
        include: {
          membros: true,
        },
      });

      if (!updatedBoard) {
        throw {
          statusCode: 500,
          message: "Erro ao atualizar banca",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: enrollment.raAluno,
          idSemestre: enrollment.idSemestre,
          etapa: "TCC1",
          status: "banca_preenchida",
          observacao:
            `Atualização Banca por administrador\n` +
            `Banca: ${members.map((member) => member.nome).join(", ")}`,
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
        to: members.map((member) => member.email).join(", "),
        subject: "Banca TCC atualizada",
        text:
          `Olá!\n\n` +
          `Você foi definido como membro da banca do aluno ${enrollment.Aluno.nome} (RA: ${enrollment.Aluno.ra})\n\n` +
          `Para mais informações, entre em contato com o PRATCC (${adminName} - ${adminEmail}) \n\n`,
      });
      if (response.status === "error") {
        throw {
          statusCode: 500,
          message: "Erro ao enviar email para membros da banca",
        };
      }
    });
    return transaction;
  }

  async removeBoard({ enrollmentId, admin }) {
    const adminName = admin?.nome;

    if (!enrollmentId) {
      throw {
        statusCode: 400,
        message: "IdMatricula não informado",
      };
    }

    const enrollment = await this.prisma.alunoMatriculado.findFirst({
      where: {
        id: enrollmentId,
      },
      include: {
        Banca: {
          include: {
            membros: true,
          },
        },
        Aluno: true,
        Semestre: true,
      },
    });

    if (!enrollment) {
      throw {
        statusCode: 404,
        message: "Matrícula não encontrada",
      };
    }

    if (enrollment.status !== "banca_preenchida") {
      throw {
        statusCode: 400,
        message: "O status do aluno não permite a remoção da banca",
      };
    }

    if (!enrollment.Banca.id) {
      throw {
        statusCode: 404,
        message: "Banca não encontrada",
      };
    }

    if (!enrollment.Semestre.ativo) {
      throw {
        statusCode: 404,
        message: "Semestre não ativo",
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const deletedBoardMembers = await prisma.bancaMembro.deleteMany({
        where: {
          bancaId: enrollment.Banca.id,
        },
      });

      if (!deletedBoardMembers) {
        throw {
          statusCode: 500,
          message: "Erro ao remover membros da banca",
        };
      }

      const deletedBoard = await prisma.banca.delete({
        where: {
          id: enrollment.Banca.id,
        },
        include: {
          membros: true,
        },
      });

      if (!deletedBoard) {
        throw {
          statusCode: 500,
          message: "Erro ao remover banca",
        };
      }

      const updatedEnrollment = await prisma.alunoMatriculado.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: "orientador_definido",
        },
      });

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: updatedEnrollment.raAluno,
          idSemestre: updatedEnrollment.idSemestre,
          etapa: "TCC1",
          status: "orientador_definido",
          observacao: `Banca removida por administrador ${adminName}`,
        },
      });

      if (!createHistory) {
        throw {
          statusCode: 500,
          message: "Erro ao criar histórico",
        };
      }
    });
    return transaction;
  }

  async studentDefineBoard({ membersIds, studentToken }) {
    const schema = yup.object().shape({
      membersIds: yup
        .array()
        .of(yup.number())
        .min(3)
        .required("idMembros é um campo obrigatório"),
      studentToken: yup.string().required(),
    });

    try {
      await schema.validate({
        membersIds,
        studentToken: studentToken,
      });
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const payload = await this.jwtService
      .verifyAsync(studentToken, {
        secret: process.env.STUDENT_JWT_SECRET,
      })
      .then((payload) => payload)
      .catch((err) => {
        throw {
          statusCode: 401,
          message: "[1] Token inválido " + err,
        };
      });

    const enrollmentId = payload.id;
    const status = payload.status;
    const adminId = payload.adminId;

    if (status != "definir-banca") {
      throw {
        statusCode: 401,
        message: "[2] Token Inválido",
      };
    }

    const enrollment = await this.prisma.alunoMatriculado.findFirst({
      where: {
        id: enrollmentId,
      },
      include: {
        Aluno: true,
        Semestre: true,
      },
    });

    if (
      !enrollment ||
      enrollment.status !== "orientador_definido" ||
      !enrollment.Semestre.ativo
    ) {
      throw {
        statusCode: 400,
        message: "Matrícula inválida",
      };
    }

    const admin = await this.prisma.administrador.findFirst({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
      };
    }

    const members = await this.prisma.professor.findMany({
      where: {
        id: {
          in: membersIds,
        },
        ativo: true,
      },
    });

    if (members.length !== membersIds.length) {
      throw {
        statusCode: 404,
        message: "Membro da banca não encontrado",
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedEnrollment = await prisma.alunoMatriculado.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: "banca_preenchida",
        },
        include: {
          Aluno: true,
        },
      });

      const createdBoard = await prisma.banca.create({
        data: {
          idAlunoMatriculado: enrollmentId,
        },
      });

      if (!createdBoard) {
        throw {
          statusCode: 500,
          message: "Erro ao definir banca",
        };
      }

      const createBoardMembers = await prisma.bancaMembro.createMany({
        data: members.map((member) => ({
          bancaId: createdBoard.id,
          professorId: member.id,
          isPresidente: member.id === membersIds[0],
        })),
      });

      if (!createBoardMembers) {
        throw {
          statusCode: 500,
          message: "Erro ao definir membros da banca",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: updatedEnrollment.raAluno,
          idSemestre: enrollment.Semestre.id,
          etapa: "TCC1",
          status: "banca_preenchida",
          observacao:
            `Definição Banca por aluno\n` +
            `Banca: ${members.map((member) => member.nome).join(", ")}`,
        },
      });

      if (!createHistory) {
        throw {
          statusCode: 500,
          message: "Erro ao criar histórico",
        };
      }

      const response = await sendEmail({
        user: admin.emailSistema,
        pass: admin.chaveEmailSistema,
        from: `${admin.nome} <${admin.emailSistema}>`,
        to: members.map((member) => member.email).join(", "),
        subject: `Banca TCC1 definida - ${updatedEnrollment.Aluno.nome}`,
        text:
          `Olá!\n\n` +
          `Você foi definido como membro da banca do aluno ${updatedEnrollment.Aluno.nome} (RA: ${updatedEnrollment.Aluno.ra})\n\n` +
          `Para mais informações, entre em contato com o PRATCC (${admin.nome} - ${admin.email}) \n\n`,
      });
      if (response.status === "error") {
        throw {
          statusCode: 500,
          message: "Erro ao enviar email para membros da banca",
        };
      }
    });
    return transaction;
  }

  async adminScheduleBoard({
    enrollmentId,
    schedule,
    location,
    admin,
  }: {
    enrollmentId: number;
    schedule: string;
    location: string;
    admin;
  }) {
    const schema = yup.object().shape({
      enrollmentId: yup.number().required(),
      schedule: yup.date().required(),
      location: yup.string().required(),
    });

    try {
      await schema.validate({
        enrollmentId,
        schedule,
        location,
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
      include: {
        Aluno: true,
        Banca: {
          include: {
            membros: true,
          },
        },
        Semestre: true,
      },
    });

    if (
      !enrollment ||
      enrollment.status !== "banca_preenchida" ||
      !enrollment.Banca.id ||
      !enrollment.Semestre.ativo
    ) {
      throw {
        statusCode: 404,
        message: "Matrícula inválida",
      };
    }

    const adminInfo = await this.prisma.administrador.findFirst({
      where: {
        id: admin.id,
      },
      include: {
        googleCredentials: true,
      },
    });

    if (!adminInfo) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
      };
    }

    if (!adminInfo.googleCredentials) {
      throw {
        statusCode: 500,
        message: "Credenciais do Google Calendar não configuradas",
      };
    }

    if (!adminInfo.idCalendario) {
      throw {
        statusCode: 500,
        message: "ID do calendário do Google não configurado",
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedBoard = await prisma.banca.update({
        where: {
          id: enrollment.Banca.id,
        },
        data: {
          dataHorario: schedule,
          local: location,
        },
      });

      if (!updatedBoard) {
        throw {
          statusCode: 500,
          message: "Erro ao agendar banca",
        };
      }

      const updatedEnrollment = await prisma.alunoMatriculado.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: "banca_agendada",
        },
        include: {
          Aluno: true,
          Orientador: true,
          Coorientador: true,
          Banca: {
            include: {
              membros: true,
            },
          },
        },
      });

      if (!updatedEnrollment) {
        throw {
          statusCode: 500,
          message: "Erro ao atualizar matrícula",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: enrollment.raAluno,
          idSemestre: enrollment.idSemestre,
          etapa: "TCC1",
          status: "banca_agendada",
          observacao:
            `Agendamento de banca por administrador \n` +
            `Data: ${schedule}\n` +
            `Local: ${location}`,
        },
      });

      if (!createHistory) {
        throw {
          statusCode: 500,
          message: "Erro ao criar histórico",
        };
      }

      const members = await prisma.bancaMembro.findMany({
        where: {
          bancaId: enrollment.Banca.id,
        },
        include: {
          professor: true,
        },
      });

      const googleCalendarEvent = await createEvent({
        calendarId: adminInfo.idCalendario,
        credentials: adminInfo.googleCredentials,
        eventInfo: {
          title:
            enrollment.etapa == "TCC1"
              ? `Banca TCC1 - ${updatedEnrollment.Aluno.nome}`
              : `Banca TCC2 - ${updatedEnrollment.Aluno.nome}`,
          description:
            `Aluno: ${updatedEnrollment.Aluno.nome} (RA: ${enrollment.Aluno.ra})\n` +
            `Orientador: ${updatedEnrollment.Orientador.nome}\n` +
            `Coorientador: ${updatedEnrollment.Coorientador ? updatedEnrollment.Coorientador.nome : "Não definido"}\n` +
            `Banca: ${members.map((member) => member.professor.nome).join(", ")}\n`,
          dateTime: schedule,
          location: location,
        },
      });

      if (!googleCalendarEvent || googleCalendarEvent.status === "error") {
        throw {
          statusCode: 500,
          message: googleCalendarEvent.message,
        };
      }

      const response = await sendEmail({
        user: adminInfo.emailSistema,
        pass: adminInfo.chaveEmailSistema,
        from: adminInfo.emailSistema,
        to: members.map((member) => member.professor.email).join(", "),
        subject: `Banca TCC1 agendada - ${enrollment.Aluno.nome}`,
        text:
          `Olá!\n\n` +
          `A banca do aluno ${enrollment.Aluno.nome} (RA: ${enrollment.Aluno.ra}) foi agendada.\n` +
          `Data: ${new Date(schedule).toLocaleDateString()}\n` +
          `Local: ${location}\n\n` +
          `Link para o evento no Google Agenda: ${googleCalendarEvent.data.htmlLink}\n` +
          `Para mais informações, entre em contato com o PRATCC\n\n`,
      });

      if (response.status === "error") {
        throw {
          statusCode: 500,
          message: "Erro ao enviar email para membros da banca",
        };
      }
    });

    return transaction;
  }
}
