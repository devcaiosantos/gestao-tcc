import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import sendEmail from "src/utils/mailTransporter";
import { createEvent } from "src/service/calendarAPI/createEvent";
import { removeEvent } from "src/service/calendarAPI/removeEvent";
import * as yup from "yup";

@Injectable()
export class BoardService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async adminDefineBoard({ enrollmentId, membersIds, title, admin }) {
    const adminName = admin?.nome;
    const adminEmail = admin?.email;
    const systemEmail = admin?.emailSistema;
    const systemEmailKey = admin?.chaveEmailSistema;

    const schema = yup.object().shape({
      title: yup.string().required(),
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
        title,
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
        Semestre: true,
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

    if (!enrollment.Semestre.ativo) {
      throw {
        statusCode: 400,
        message: "Matrícula não pertence ao semestre ativo",
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
          titulo: title,
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
          etapa: enrollment.etapa,
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
        subject: `Banca ${updatedEnrollment.etapa} definida - ${updatedEnrollment.Aluno.nome}`,
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

  async adminUpdateBoard({ enrollmentId, membersIds, admin, title }) {
    const adminName = admin?.nome;
    const adminEmail = admin?.email;
    const systemEmail = admin?.emailSistema;
    const systemEmailKey = admin?.chaveEmailSistema;

    const schema = yup.object().shape({
      title: yup.string().required(),
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
        title,
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
          titulo: title,
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
          etapa: enrollment.etapa,
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
          etapa: updatedEnrollment.etapa,
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

  async studentDefineBoard({ membersIds, studentToken, title }) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      membersIds: yup
        .array()
        .of(yup.number())
        .min(3)
        .required("idMembros é um campo obrigatório"),
      studentToken: yup.string().required(),
    });

    try {
      await schema.validate({
        title: title,
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
          titulo: title,
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
          etapa: enrollment.etapa,
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
        subject: `Banca ${enrollment.etapa} definida - ${updatedEnrollment.Aluno.nome}`,
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
        Orientador: true,
        Coorientador: true,
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

    const members = await this.prisma.bancaMembro.findMany({
      where: {
        bancaId: enrollment.Banca.id,
      },
      include: {
        professor: true,
      },
    });

    if (!members) {
      throw {
        statusCode: 500,
        message: "Erro ao buscar membros da banca",
      };
    }

    const transaction = await this.prisma.$transaction(
      async (prisma) => {
        const googleCalendarEvent = await createEvent({
          calendarId: adminInfo.idCalendario,
          credentials: adminInfo.googleCredentials,
          eventInfo: {
            title: `Banca ${enrollment.etapa} - ${enrollment.Aluno.nome}`,
            description:
              `Aluno: ${enrollment.Aluno.nome} (RA: ${enrollment.Aluno.ra})\n` +
              `Orientador: ${enrollment.Orientador.nome}\n` +
              `Coorientador: ${enrollment.Coorientador ? enrollment.Coorientador.nome : "Não definido"}\n` +
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

        const updatedBoard = await prisma.banca.update({
          where: {
            id: enrollment.Banca.id,
          },
          data: {
            dataHorario: schedule,
            local: location,
            idEventoAgenda: googleCalendarEvent.data.id,
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
            etapa: enrollment.etapa,
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

        const response = await sendEmail({
          user: adminInfo.emailSistema,
          pass: adminInfo.chaveEmailSistema,
          from: adminInfo.emailSistema,
          to: members.map((member) => member.professor.email).join(", "),
          subject: `Banca ${enrollment.etapa} agendada - ${enrollment.Aluno.nome}`,
          text:
            `Olá!\n\n` +
            `A banca do aluno ${enrollment.Aluno.nome} (RA: ${enrollment.Aluno.ra}) foi agendada.\n` +
            `Data: ${new Date(schedule).toLocaleDateString()}\n` +
            `Local: ${location}\n\n` +
            `Para mais informações, entre em contato com o PRATCC\n\n`,
        });

        if (response.status === "error") {
          throw {
            statusCode: 500,
            message: "Erro ao enviar email para membros da banca",
          };
        }
      },
      {
        timeout: 10000, // Aumenta o timeout para 10 segundos
      },
    );

    return transaction;
  }

  async unscheduleBoard({ enrollmentId, admin }) {
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

    if (enrollment.status !== "banca_agendada") {
      throw {
        statusCode: 400,
        message: "O status do aluno não permite o cancelamento da banca",
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
      const unscheduleBoard = await prisma.banca.update({
        where: {
          id: enrollment.Banca.id,
        },
        data: {
          dataHorario: null,
          local: null,
        },
      });

      if (!unscheduleBoard) {
        throw {
          statusCode: 500,
          message: "Erro ao desmarcar banca",
        };
      }

      const updatedEnrollment = await prisma.alunoMatriculado.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: "banca_preenchida",
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
          etapa: enrollment.etapa,
          status: "banca_preenchida",
          observacao: `Banca desmarcada por administrador`,
        },
      });

      if (!createHistory) {
        throw {
          statusCode: 500,
          message: "Erro ao criar histórico",
        };
      }

      const googleCalendarEvent = await removeEvent({
        calendarId: adminInfo.idCalendario,
        credentials: adminInfo.googleCredentials,
        eventId: unscheduleBoard.idEventoAgenda,
      });

      if (!googleCalendarEvent || googleCalendarEvent.status === "error") {
        throw {
          statusCode: 500,
          message: googleCalendarEvent.message,
        };
      }
    });

    return transaction;
  }

  async studentScheduleBoard({ schedule, location, studentToken }) {
    const schema = yup.object().shape({
      schedule: yup.date().required(),
      location: yup.string().required(),
      studentToken: yup.string().required(),
    });

    try {
      await schema.validate({
        schedule,
        location,
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

    if (status != "agendar-banca") {
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
        Banca: {
          include: {
            membros: true,
          },
        },
        Semestre: true,
        Orientador: true,
        Coorientador: true,
      },
    });

    if (
      !enrollment ||
      enrollment.status !== "banca_preenchida" ||
      !enrollment.Banca.id ||
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

    const adminInfo = await this.prisma.administrador.findFirst({
      where: {
        id: adminId,
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

    const members = await this.prisma.bancaMembro.findMany({
      where: {
        bancaId: enrollment.Banca.id,
      },
      include: {
        professor: true,
      },
    });

    if (!members) {
      throw {
        statusCode: 500,
        message: "Erro ao buscar membros da banca",
      };
    }

    const transaction = await this.prisma.$transaction(
      async (prisma) => {
        const googleCalendarEvent = await createEvent({
          calendarId: adminInfo.idCalendario,
          credentials: adminInfo.googleCredentials,
          eventInfo: {
            title: `Banca ${enrollment.etapa} - ${enrollment.Aluno.nome}`,
            description:
              `Aluno: ${enrollment.Aluno.nome} (RA: ${enrollment.Aluno.ra})\n` +
              `Orientador: ${enrollment.Orientador.nome}\n` +
              `Coorientador: ${enrollment.Coorientador ? enrollment.Coorientador.nome : "Não definido"}\n` +
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

        const updatedBoard = await prisma.banca.update({
          where: {
            id: enrollment.Banca.id,
          },
          data: {
            dataHorario: schedule,
            local: location,
            idEventoAgenda: googleCalendarEvent.data.id,
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
            etapa: enrollment.etapa,
            status: "banca_agendada",
            observacao:
              `Agendamento de banca por aluno \n` +
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

        const response = await sendEmail({
          user: adminInfo.emailSistema,
          pass: adminInfo.chaveEmailSistema,
          from: adminInfo.emailSistema,
          to: members.map((member) => member.professor.email).join(", "),
          subject: `Banca ${enrollment.etapa} agendada - ${enrollment.Aluno.nome}`,
          text:
            `Olá!\n\n` +
            `A banca do aluno ${enrollment.Aluno.nome} (RA: ${enrollment.Aluno.ra}) foi agendada.\n` +
            `Data: ${new Date(schedule).toLocaleDateString()}\n` +
            `Local: ${location}\n\n` +
            `Para mais informações, entre em contato com o PRATCC\n\n`,
        });

        if (response.status === "error") {
          throw {
            statusCode: 500,
            message: "Erro ao enviar email para membros da banca",
          };
        }
      },
      {
        timeout: 10000, // Aumenta o timeout para 10 segundos
      },
    );

    return transaction;
  }

  async assignGrade({ enrollmentId, grade }) {
    const schema = yup.object().shape({
      enrollmentId: yup.number().required(),
      grade: yup.number().min(0).max(10).required(),
    });

    try {
      await schema.validate({
        enrollmentId,
        grade,
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
      enrollment.status !== "banca_agendada" ||
      !enrollment.Banca.id ||
      !enrollment.Semestre.ativo
    ) {
      throw {
        statusCode: 400,
        message: "Matrícula inválida",
      };
    }

    const NEW_STATUS = grade >= 6 ? "aprovado" : "reprovado";

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedEnrollment = await prisma.alunoMatriculado.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: NEW_STATUS,
        },
      });

      if (!updatedEnrollment) {
        throw {
          statusCode: 500,
          message: "Erro ao atualizar matrícula",
        };
      }

      const updatedBoard = await prisma.banca.update({
        where: {
          id: enrollment.Banca.id,
        },
        data: {
          nota: grade,
        },
      });

      if (!updatedBoard) {
        throw {
          statusCode: 500,
          message: "Erro ao atribuir nota",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: enrollment.raAluno,
          idSemestre: enrollment.idSemestre,
          etapa: enrollment.etapa,
          status: NEW_STATUS,
          observacao: `Nota atribuída: ${grade}, ${NEW_STATUS}`,
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

  async removeGrade(enrollmentId: number) {
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

    if (
      !enrollment ||
      (enrollment.status !== "aprovado" && enrollment.status !== "reprovado") ||
      !enrollment.Semestre.ativo
    ) {
      throw {
        statusCode: 404,
        message: "Matrícula inválida",
      };
    }

    const transaction = await this.prisma.$transaction(async (prisma) => {
      const updatedEnrollment = await prisma.alunoMatriculado.update({
        where: {
          id: enrollmentId,
        },
        data: {
          status: "banca_agendada",
        },
      });

      if (!updatedEnrollment) {
        throw {
          statusCode: 500,
          message: "Erro ao atualizar matrícula",
        };
      }

      const updatedBoard = await prisma.banca.update({
        where: {
          id: enrollment.Banca.id,
        },
        data: {
          nota: null,
        },
      });

      if (!updatedBoard) {
        throw {
          statusCode: 500,
          message: "Erro ao remover nota",
        };
      }

      const createHistory = await prisma.historicoAluno.create({
        data: {
          raAluno: enrollment.raAluno,
          idSemestre: enrollment.idSemestre,
          etapa: enrollment.etapa,
          status: "banca_agendada",
          observacao: `Nota removida por administrador`,
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
