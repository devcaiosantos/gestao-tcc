import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { object, string } from "yup";
@Injectable()
export class GoogleCredentialsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ adminId, credentials }) {
    const admin = await this.prisma.administrador.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      throw new Error("Admin not found");
    }

    const schema = object({
      type: string().required(),
      projectId: string().required(),
      privateKeyId: string().required(),
      privateKey: string().required(),
      clientEmail: string().required(),
      clientId: string().required(),
      authUri: string().required(),
      tokenUri: string().required(),
      authProviderX509CertUrl: string().required(),
      clientX509CertUrl: string().required(),
    });

    try {
      await schema.validate(credentials, { abortEarly: false });
    } catch (error) {
      const errorMessages = error.errors.join(", ");
      throw {
        statusCode: 400,
        message: errorMessages,
      };
    }

    return this.prisma.googleCredentials.create({
      data: {
        administradorId: admin.id,
        ...credentials,
      },
    });
  }

  async get(adminId: number) {
    return this.prisma.googleCredentials.findFirst({
      where: {
        administradorId: adminId,
      },
    });
  }

  async delete(adminId: number) {
    return this.prisma.googleCredentials.deleteMany({
      where: {
        administradorId: adminId,
      },
    });
  }

  async update({ adminId, credentials }) {
    const admin = await this.prisma.administrador.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      throw {
        statusCode: 404,
        message: "Admin not found",
      };
    }

    const schema = object({
      type: string().required(),
      projectId: string().required(),
      privateKeyId: string().required(),
      privateKey: string().required(),
      client_email: string().required(),
      clientId: string().required(),
      authUri: string().required(),
      tokenUri: string().required(),
      authProviderX509CertUrl: string().required(),
      clientX509CertUrl: string().required(),
      universeDomain: string().required(),
    });

    try {
      await schema.validate(credentials);
    } catch (error) {}

    return this.prisma.googleCredentials.update({
      where: {
        administradorId: admin.id,
      },
      data: {
        ...credentials,
      },
    });
  }
}
