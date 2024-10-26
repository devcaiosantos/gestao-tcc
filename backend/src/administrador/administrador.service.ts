import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Administrador } from "@prisma/client";
import { createAdministradorProps, resetPasswordProps } from "./interfaces";
import { object, string } from "yup";
import * as bcrypt from "bcrypt";

@Injectable()
export class AdministradorService {
  constructor(private prisma: PrismaService) {}

  async create(administrador: createAdministradorProps) {
    try {
      const createAdministradorSchema = object().shape({
        nome: string().required(),
        email: string().email().required(),
        senha: string().min(8).required(),
        emailSistema: string().email(),
        chaveEmailSistema: string(),
      });
      await createAdministradorSchema.validate(administrador);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const existingAdministrador = await this.prisma.administrador.findUnique({
      where: {
        email: administrador.email,
      },
    });

    if (existingAdministrador) {
      throw {
        statusCode: 400,
        message: "Email já cadastrado",
      };
    }
    const salt = 10;
    const hash = await bcrypt.hash(administrador.senha, salt);

    const createdAdministrador = await this.prisma.administrador.create({
      data: {
        nome: administrador.nome,
        email: administrador.email,
        senha: hash,
        emailSistema: administrador.emailSistema,
        chaveEmailSistema: administrador.chaveEmailSistema,
      },
    });
    if (!createdAdministrador) {
      throw {
        statusCode: 500,
        message: "Erro ao criar administrador",
      };
    }

    return {
      id: createdAdministrador.id,
      nome: createdAdministrador.nome,
      email: createdAdministrador.email,
    };
  }

  async findAll(): Promise<Administrador[]> {
    return this.prisma.administrador.findMany();
  }

  async findOne(id: number) {
    const existingAdministrador = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!existingAdministrador) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
      };
    }

    return {
      id: existingAdministrador.id,
      nome: existingAdministrador.nome,
      email: existingAdministrador.email,
      emailSistema: existingAdministrador.emailSistema,
      chaveEmailSistema: existingAdministrador.chaveEmailSistema,
    };
  }

  async update(id: number, newAdministrador: createAdministradorProps) {
    const existingAdministrador = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!existingAdministrador) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
      };
    }

    try {
      const updateAdministradorSchema = object().shape({
        nome: string().required(),
        email: string().email().required(),
        emailSistema: string().email(),
        chaveEmailSistema: string(),
      });
      await updateAdministradorSchema.validate(newAdministrador);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const updatedAdministrador = await this.prisma.administrador.update({
      where: { id },
      data: {
        nome: newAdministrador.nome,
        email: newAdministrador.email,
        emailSistema: newAdministrador.emailSistema,
        chaveEmailSistema: newAdministrador.chaveEmailSistema,
      },
    });

    if (!updatedAdministrador) {
      throw {
        statusCode: 500,
        message: "Erro ao atualizar administrador",
      };
    }

    return {
      id: updatedAdministrador.id,
      nome: updatedAdministrador.nome,
      email: updatedAdministrador.email,
      emailSistema: updatedAdministrador.emailSistema,
      chaveEmailSistema: updatedAdministrador.chaveEmailSistema,
    };
  }

  async resetPassword(id: number, { senha, novaSenha }: resetPasswordProps) {
    const existingAdministrador = await this.prisma.administrador.findUnique({
      where: { id },
    });

    if (!existingAdministrador) {
      throw {
        statusCode: 404,
        message: "Administrador não encontrado",
      };
    }
    const isMatch = await bcrypt.compare(senha, existingAdministrador.senha);
    if (!isMatch) {
      throw {
        statusCode: 400,
        message: "Senha incorreta",
      };
    }

    const newPasswordSchema = object().shape({
      novaSenha: string().min(8).required(),
    });

    try {
      await newPasswordSchema.validate({ novaSenha });
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const salt = 10;
    const hash = await bcrypt.hash(novaSenha, salt);

    try {
      const updatedAdministrador = await this.prisma.administrador.update({
        where: { id },
        data: { senha: hash },
      });

      return {
        id: updatedAdministrador.id,
        nome: updatedAdministrador.nome,
        email: updatedAdministrador.email,
      };
    } catch {
      throw {
        statusCode: 500,
        message: "Erro ao atualizar senha",
      };
    }
  }

  async remove(id: number) {
    try {
      const deletedAdministrador = await this.prisma.administrador.delete({
        where: { id },
      });

      return {
        id: deletedAdministrador.id,
        nome: deletedAdministrador.nome,
        email: deletedAdministrador.email,
      };
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Erro ao deletar administrador",
      };
    }
  }
}
