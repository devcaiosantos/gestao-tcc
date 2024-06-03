import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { createProfessorProps } from "./interfaces";
import { object, string, mixed, boolean } from "yup";

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
        ativo: boolean().required(),
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
        ativo: professor.ativo,
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
      ativo: createdProfessor.ativo,
    };
  }

  findAll() {
    return this.prisma.professor.findMany({
      orderBy: {
        nome: "asc",
      },
    });
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
        ativo: boolean().required(),
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
        ativo: updateProfessorProps.ativo,
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
      ativo: updatedProfessor.ativo,
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

  async search(term: string) {
    return this.prisma.professor.findMany({
      where: {
        OR: [
          {
            nome: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
      orderBy: {
        nome: "asc",
      },
    });
  }
}
