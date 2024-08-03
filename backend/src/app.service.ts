import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "./prisma/prisma.service";
import sendEmail from "./utils/mailTransporter";
import { string, array, object } from "yup";
@Injectable()
export class AppService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  getHello(): string {
    return "BACKEND GESTÃO TCC!";
  }

  async sendDirectMail({ admin, recipients, subject, text }) {
    const systemEmail = admin.emailSistema;
    const systemEmailKey = admin.chaveEmailSistema;

    const schema = object().shape({
      systemEmail: string().email().required(),
      systemEmailKey: string().required(),
      recipients: array().of(string().email()).required(),
      subject: string().required(),
      text: string().required(),
    });

    try {
      await schema.validate({
        systemEmail,
        systemEmailKey,
        recipients,
        subject,
        text,
      });
    } catch (err) {
      throw {
        message: err.message,
        statusCode: 400,
      };
    }

    const mailsInfo = [];

    for (const recipient of recipients) {
      let formattedText = text;
      const enrollment = await this.prisma.alunoMatriculado.findFirst({
        where: {
          Aluno: {
            email: recipient,
          },
          Semestre: {
            ativo: true,
          },
        },
        include: {
          Aluno: true,
          Semestre: true,
        },
      });

      if (!enrollment) {
        throw {
          message: `Não foi possível encontrar a matrícula do aluno com email ${recipient}.`,
          statusCode: 404,
        };
      }

      formattedText = formattedText.replace(
        "<nomeAluno>",
        enrollment.Aluno.nome,
      );

      if (text.includes("<linkDefinirOrientador>")) {
        if (enrollment.status != "matriculado") {
          throw {
            message: `Não é possível gerar um 'linkDefinirOrientador' para o aluno de e-mail ${enrollment.Aluno.email}.`,
            statusCode: 400,
          };
        }
        const enrollmentToken = await this.jwtService.signAsync(
          {
            id: enrollment.id,
            ra: enrollment.Aluno.ra,
            tipo: "definir-orientador",
          },
          {
            secret: process.env.STUDENT_JWT_SECRET,
            expiresIn: process.env.STUDENT_JWT_EXPIRES,
          },
        );
        formattedText = formattedText.replace(
          "<linkDefinirOrientador>",
          `${process.env.FRONTEND_URL}/definir-orientador?token=${enrollmentToken}`,
        );
      }

      if (text.includes("<linkDefinirBanca>")) {
        if (enrollment.status != "orientador_definido") {
          throw {
            message: `Não é possível gerar um 'linkDefinirBanca' para o aluno de e-mail ${enrollment.Aluno.email}.`,
            statusCode: 400,
          };
        }
        const enrollmentToken = await this.jwtService.signAsync(
          {
            id: enrollment.id,
            ra: enrollment.Aluno.ra,
            tipo: "definir-banca",
          },
          {
            secret: process.env.STUDENT_JWT_SECRET,
            expiresIn: process.env.STUDENT_JWT_EXPIRES,
          },
        );

        formattedText = formattedText.replace(
          "<linkDefinirBanca>",
          `${process.env.FRONTEND_URL}/definir-banca?token=${enrollmentToken}`,
        );
      }

      mailsInfo.push({
        from: systemEmail,
        to: recipient,
        subject,
        text: formattedText,
      });
    }

    const emailResponses = await Promise.all(
      mailsInfo.map((mail) =>
        sendEmail({
          user: systemEmail,
          pass: systemEmailKey,
          from: mail.from,
          to: mail.to,
          subject: mail.subject,
          text: mail.text,
        }),
      ),
    );

    return emailResponses;
  }
}
