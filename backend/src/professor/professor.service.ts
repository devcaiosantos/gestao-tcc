import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createProfessorProps } from "./interfaces";
import { object, string, mixed } from "yup";

const departamentos = [
  "DACOM",
  "DAAMB",
  "DACOC",
  "DAELN",
  "DAAEQ",
  "DAQUI",
  "DABIC",
  "DAFIS",
  "DAGEE",
  "DAHUM",
  "DAMAT",
  "OUTRO",
];

@Injectable()
export class ProfessorService {
  constructor(private prisma: PrismaService) {}
  async create(professor: createProfessorProps) {
    try {
      const createAdministradorSchema = object().shape({
        nome: string().required(),
        email: string().email().required(),
        departamento: mixed().oneOf(departamentos),
      });
      await createAdministradorSchema.validate(professor);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const existingProfessor = await this.prisma.professor.findUnique({
      where: {
        email: professor.email,
      },
    });

    if (existingProfessor) {
      throw {
        statusCode: 400,
        message: "Email já cadastrado",
      };
    }

    const createdProfessor = await this.prisma.professor.create({
      data: {
        nome: professor.nome,
        email: professor.email,
        departamento: professor.departamento,
      },
    });
    if (!createdProfessor) {
      throw {
        statusCode: 500,
        message: "Erro ao criar professor",
      };
    }

    return {
      id: createdProfessor.id,
      nome: createdProfessor.nome,
      email: createdProfessor.email,
      departamento: createdProfessor.departamento,
    };
  }

  findAll() {
    return this.prisma.professor.findMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} professor`;
  }

  async update(id: number, updateProfessorProps: createProfessorProps) {
    try {
      const updateAdministradorSchema = object().shape({
        nome: string().required(),
        email: string().email().required(),
        departamento: mixed().oneOf(departamentos),
      });
      await updateAdministradorSchema.validate(updateProfessorProps);
    } catch (error) {
      throw {
        statusCode: 400,
        message: error.message,
      };
    }

    const existingProfessor = await this.prisma.professor.findUnique({
      where: { id },
    });

    if (!existingProfessor) {
      throw {
        statusCode: 404,
        message: "Professor não encontrado",
      };
    }

    const updatedProfessor = await this.prisma.professor.update({
      where: { id },
      data: {
        nome: updateProfessorProps.nome,
        email: updateProfessorProps.email,
        departamento: updateProfessorProps.departamento,
      },
    });

    if (!updatedProfessor) {
      throw {
        statusCode: 500,
        message: "Erro ao atualizar professor",
      };
    }

    return {
      id: updatedProfessor.id,
      nome: updatedProfessor.nome,
      email: updatedProfessor.email,
      departamento: updatedProfessor.departamento,
    };
  }

  remove(id: number) {
    try {
      return this.prisma.professor.delete({
        where: { id },
      });
    } catch (error) {
      throw {
        statusCode: 500,
        message: "Erro ao deletar professor",
      };
    }
  }
}
