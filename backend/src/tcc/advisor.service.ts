import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import sendEmail from "src/utils/mailTransporter";
import * as yup from "yup";

@Injectable()
export class AdvisorService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

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
      include: {
        Semestre: true,
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

    if (enrollment.Semestre.ativo === false) {
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
          Orientador: true,
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
          etapa: enrollment.etapa,
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
        subject: `Orientador ${updatedEnrollment.etapa} definido`,
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
          etapa: enrollment.etapa,
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
        subject: `Orientador ${enrollment.etapa} definido`,
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

    if (!enrollment.Semestre.ativo) {
      throw {
        statusCode: 500,
        message: "O Semestre não está ativo",
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
          idSemestre: enrollment.Semestre.id,
          etapa: enrollment.etapa,
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
}
