import { Injectable } from "@nestjs/common";
import { EnrollStudent, IfindEnrollmentsProps, Stage } from "./interfaces";
import { PrismaService } from "../prisma/prisma.service";
import * as yup from "yup";
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
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async findEnrollmentsByIdSemester({
    stage,
    idSemester,
    term,
    status,
  }: IfindEnrollmentsProps) {
    const schema = yup.object().shape({
      idSemester: yup.number().required(),
      term: yup.string().notRequired(),
      status: yup.mixed().oneOf(statusOptions).notRequired(),
      stage: yup.mixed().oneOf(["TCC1", "TCC2"]).required(),
    });

    try {
      await schema.validate({
        idSemester,
        term,
        status,
        stage,
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
          etapa: stage,
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

  async enrollTCC1({
    stage,
    student,
  }: {
    stage: Stage;
    student: EnrollStudent;
  }) {
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
        OR: [
          {
            ra: student.ra,
          },
          {
            email: student.email,
          },
        ],
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
      (student.email == registeredStudent.email ||
        student.ra != registeredStudent.ra)
    ) {
      throw {
        statusCode: 400,
        message: `E-mail já está cadastrado com outro RA (${registeredStudent.ra})`,
      };
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
          etapa: stage,
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
          etapa: stage,
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

  async enrollTCC2({
    stage,
    student,
  }: {
    stage: Stage;
    student: EnrollStudent;
  }) {
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

    const previousEnrollments = await this.prisma.alunoMatriculado.findMany({
      where: {
        raAluno: student.ra,
      },
      include: {
        Aluno: true,
      },
    });

    const alreadyEnrolled = previousEnrollments.find(
      (enrollment) => enrollment.idSemestre === activeSemester.id,
    );

    if (alreadyEnrolled) {
      throw {
        statusCode: 400,
        message: `Já existe um aluno com este RA matriculado em ${alreadyEnrolled.etapa} no semestre ${activeSemester.ano}/${activeSemester.numero}`,
      };
    }

    const aprovedTCC1 = previousEnrollments.find((enrollment) => {
      return enrollment.etapa === "TCC1" && enrollment.status === "aprovado";
    });

    if (!aprovedTCC1) {
      throw {
        statusCode: 400,
        message: "O aluno ainda não foi aprovado em TCC1",
      };
    }

    if (
      aprovedTCC1.Aluno &&
      (aprovedTCC1.Aluno.email !== student.email ||
        aprovedTCC1.Aluno.nome !== student.nome)
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
          etapa: stage,
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
          etapa: stage,
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

  async enrollBatchTCC1(students: EnrollStudent[]) {
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

  async enrollBatchTCC2(students: EnrollStudent[]) {
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
          const previousEnrollments = await prisma.alunoMatriculado.findMany({
            where: {
              raAluno: student.ra,
            },
            include: {
              Aluno: true,
            },
          });

          const alreadyEnrolled = previousEnrollments.find(
            (enrollment) => enrollment.idSemestre === activeSemester.id,
          );

          if (alreadyEnrolled) {
            throw {
              statusCode: 422,
              message: `O aluno ${student.nome} (RA: ${student.ra}) já foi matriculado em ${alreadyEnrolled.etapa} no semestre ${activeSemester.ano}/${activeSemester.numero}`,
            };
          }

          const aprovedTCC1 = previousEnrollments.find((enrollment) => {
            return (
              enrollment.etapa === "TCC1" && enrollment.status === "aprovado"
            );
          });

          if (!aprovedTCC1) {
            throw {
              statusCode: 400,
              message: "O aluno ainda não foi aprovado em TCC1",
            };
          }

          if (
            aprovedTCC1 &&
            (aprovedTCC1.Aluno.email !== student.email ||
              aprovedTCC1.Aluno.nome !== student.nome)
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
              etapa: "TCC2",
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
          etapa: deletedEnrollment.etapa,
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

  async finishSemester({
    semesterId,
    stage,
  }: {
    semesterId: number;
    stage: Stage;
  }) {
    if (!semesterId) {
      throw {
        statusCode: 400,
        message: "ID do semestre não foi informado",
      };
    }

    if (stage !== "TCC1" && stage !== "TCC2") {
      throw {
        statusCode: 400,
        message: "Etapa inválida",
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
          etapa: stage,
          status: {
            notIn: ["aprovado", "reprovado"],
          },
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
          etapa: stage,
          status: "nao_finalizado",
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
            etapa: stage,
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

  async importEnrollmentsFromSemester({
    stage,
    semesterId,
  }: {
    stage: Stage;
    semesterId: number;
  }) {
    if (!semesterId) {
      throw {
        statusCode: 400,
        message: "ID do semestre não foi informado",
      };
    }

    if (stage !== "TCC1" && stage !== "TCC2") {
      throw {
        statusCode: 400,
        message: "Etapa inválida",
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

    let enrollments = [];
    if (stage === "TCC1") {
      enrollments = await this.prisma.alunoMatriculado.findMany({
        where: {
          idSemestre: semesterId,
          etapa: stage,
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
    } else if (stage === "TCC2") {
      enrollments = await this.prisma.alunoMatriculado.findMany({
        where: {
          idSemestre: semesterId,
          OR: [
            {
              etapa: "TCC1",
              status: "aprovado",
            },
            {
              etapa: "TCC2",
              OR: [{ status: "nao_finalizado" }, { status: "reprovado" }],
            },
          ],
        },
      });
    }

    const activeEnrollments = await this.prisma.alunoMatriculado.findMany({
      where: {
        idSemestre: activeSemester.id,
        etapa: stage,
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
            etapa: stage,
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
            etapa: stage,
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
}
