import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EnrollStudent } from "./interfaces";
import * as yup from "yup";

@Injectable()
export class TCC1Service {
  constructor(private prisma: PrismaService) {}

  async findEnrollmentsByIdSemester(idSemester: number) {
    if (!idSemester) {
      throw {
        statusCode: 400,
        message: "id Semestre não informado",
      };
    }

    const enrollmentsWithStudents = await this.prisma.alunoMatriculado.findMany(
      {
        where: {
          idSemestre: idSemester,
          etapa: "TCC1",
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
}
