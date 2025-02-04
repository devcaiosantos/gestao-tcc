import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class HistoricoService {
  constructor(private prisma: PrismaService) {}
  async findByRA(ra: string) {
    if (!ra) {
      throw {
        statusCode: 400,
        message: "RA é obrigatório",
      };
    }

    return this.prisma.historicoAluno.findMany({
      where: {
        raAluno: ra,
      },
    });
  }
}
