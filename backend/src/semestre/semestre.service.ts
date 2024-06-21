import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateSemestre } from "./interfaces";
import * as yup from "yup";

@Injectable()
export class SemestreService {
  constructor(private prisma: PrismaService) {}

  async create(semestre: CreateSemestre) {
    try {
      const createSemestreSchema = yup.object().shape({
        ano: yup.number().required().integer().positive(),
        numero: yup.number().required().oneOf([1, 2]),
        ativo: yup.boolean().required(),
      });
      await createSemestreSchema.validate(semestre);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const existingSemestre = await this.prisma.semestre.findFirst({
      where: {
        ano: semestre.ano,
        numero: semestre.numero,
      },
    });

    if (existingSemestre) {
      throw {
        statusCode: 400,
        message: "Semestre já cadastrado",
      };
    }

    const createdSemestre = await this.prisma.semestre.create({
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
      orderBy: [{ ano: "asc" }, { numero: "asc" }],
    });
  }

  async update(id: number, updateSemestre: CreateSemestre) {
    try {
      const updateSemestreSchema = yup.object().shape({
        ano: yup.number().required().integer().positive(),
        numero: yup.number().required().oneOf([1, 2]),
        ativo: yup.boolean().required(),
      });
      await updateSemestreSchema.validate(updateSemestre);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }
    const updatedSemestre = await this.prisma.semestre.update({
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

  async remove(id: number) {
    try {
      const deletedSemestre = await this.prisma.semestre.delete({
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
