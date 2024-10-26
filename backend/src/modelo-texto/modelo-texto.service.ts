import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateModeloTexto } from "./interfaces";
import { object, string } from "yup";

const tiposModeloTexto = ["ATA", "DECLARACAO", "EMAIL"];

@Injectable()
export class ModeloTextoService {
  constructor(private prisma: PrismaService) {}
  async create(modeloTexto: CreateModeloTexto) {
    try {
      const createModeloTextoSchema = object().shape({
        titulo: string().required(),
        conteudo: string().required(),
        tipo: string().oneOf(tiposModeloTexto).required(),
      });
      await createModeloTextoSchema.validate(modeloTexto);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const createdModeloTexto = this.prisma.modeloTexto.create({
      data: modeloTexto,
    });

    if (!createdModeloTexto) {
      throw {
        statusCode: 500,
        message: "Erro ao criar modelo de texto",
      };
    }

    return createdModeloTexto;
  }

  findAll() {
    return this.prisma.modeloTexto.findMany({
      orderBy: {
        titulo: "asc",
      },
    });
  }

  async update(id: number, updateModeloTexto: CreateModeloTexto) {
    try {
      const updateModeloTextoSchema = object().shape({
        titulo: string(),
        conteudo: string(),
        tipo: string().oneOf(tiposModeloTexto),
      });
      await updateModeloTextoSchema.validate(updateModeloTexto);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const updatedModeloTexto = await this.prisma.modeloTexto.update({
      where: {
        id,
      },
      data: updateModeloTexto,
    });

    if (!updatedModeloTexto) {
      throw {
        statusCode: 500,
        message: "Erro ao atualizar modelo de texto",
      };
    }

    return updatedModeloTexto;
  }

  remove(id: number) {
    try {
      const deletedModeloTexto = this.prisma.modeloTexto.delete({
        where: {
          id,
        },
      });
      return deletedModeloTexto;
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Erro ao deletar modelo de texto",
      };
    }
  }

  async search(term: string) {
    return this.prisma.modeloTexto.findMany({
      where: {
        OR: [
          {
            titulo: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            conteudo: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        titulo: "asc",
      },
    });
  }
}
