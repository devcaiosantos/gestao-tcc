import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
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
        email_sistema: string().email().required(),
        senha_email_sistema: string().required(),
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
        email_sistema: administrador.email_sistema,
        senha_email_sistema: administrador.senha_email_sistema,
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

  findOne(id: number): Promise<Administrador | null> {
    return this.prisma.administrador.findUnique({
      where: { id },
    });
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
        email_sistema: string().email().required(),
        senha_email_sistema: string().required(),
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
        email_sistema: newAdministrador.email_sistema,
        senha_email_sistema: newAdministrador.senha_email_sistema,
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
      email_sistema: updatedAdministrador.email_sistema,
      senha_email_sistema: updatedAdministrador.senha_email_sistema,
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
