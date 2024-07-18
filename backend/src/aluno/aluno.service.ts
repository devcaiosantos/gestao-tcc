import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AlunoService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.aluno.findMany();
  }

  async findAlunoByRA(ra: string) {
    if (!ra) {
      throw {
        statusCode: 400,
        message: "RA não informado",
      };
    }

    const student = await this.prisma.aluno.findUnique({
      where: { ra },
    });

    if (!student) {
      throw {
        statusCode: 404,
        message: "Aluno não encontrado",
      };
    }

    return student;
  }

  async search(term: string) {
    if (!term) {
      throw {
        statusCode: 400,
        message: "Termo de busca não informado",
      };
    }
    return await this.prisma.aluno.findMany({
      where: {
        OR: [
          {
            email: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            nome: {
              contains: term,
              mode: "insensitive",
            },
          },
          {
            ra: {
              contains: term,
              mode: "insensitive",
            },
          },
        ],
      },
    });
  }
}
