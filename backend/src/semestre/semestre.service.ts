import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSemestre } from "./interfaces";
import { object, string, boolean } from "yup";

@Injectable()
export class SemestreService {
  constructor(private prisma: PrismaService) {}

  async create(semestre: CreateSemestre) {
    try {
      const createSemestreSchema = object().shape({
        id: string()
          .matches(
            /^\d{4}-[12]$/,
            "Formato inválido para o campo ID (YYYY-1 ou YYYY-2)",
          )
          .required(),
        ativo: boolean().required(),
      });
      await createSemestreSchema.validate(semestre);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }
    const createdSemestre = this.prisma.semestre.create({
      data: semestre,
    });
    if (!createdSemestre) {
      throw {
        statusCode: 500,
        message: "Erro ao criar semestre",
      };
    }
    return createdSemestre;
  }

  findAll() {
    return this.prisma.semestre.findMany({
      orderBy: {
        id: "asc",
      },
    });
  }

  async update(id: string, updateSemestre: CreateSemestre) {
    try {
      const updateSemestreSchema = object().shape({
        id: string()
          .matches(
            /^\d{4}-[12]$/,
            "Formato inválido para o campo ID (YYYY-1 ou YYYY-2)",
          )
          .required(),
        ativo: boolean().required(),
      });
      await updateSemestreSchema.validate(updateSemestre);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }
    const updatedSemestre = this.prisma.semestre.update({
      where: {
        id: id,
      },
      data: updateSemestre,
    });
    if (!updatedSemestre) {
      throw {
        statusCode: 500,
        message: "Erro ao atualizar semestre",
      };
    }
    return updatedSemestre;
  }

  async remove(id: string) {
    try {
      const deletedSemestre = this.prisma.semestre.delete({
        where: {
          id: id,
        },
      });
      return deletedSemestre;
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Erro ao deletar semestre",
      };
    }
  }
}
