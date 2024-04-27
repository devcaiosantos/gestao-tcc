import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { Administrador } from "@prisma/client";
import { createAdministradorProps } from "./interfaces";
@Injectable()
export class AdministradorService {
  constructor(private prisma: PrismaService) {}

  async create(
    administrador: createAdministradorProps,
  ): Promise<Administrador | null> {
    return this.prisma.administrador.create({
      data: administrador,
    });
  }

  async findAll(): Promise<Administrador[]> {
    return this.prisma.administrador.findMany();
  }

  findOne(id: number): Promise<Administrador | null> {
    return this.prisma.administrador.findUnique({
      where: { id },
    });
  }

  update(id: number, newAdministrador: createAdministradorProps) {
    return this.prisma.administrador.update({
      where: { id },
      data: newAdministrador,
    });
  }

  remove(id: number) {
    return this.prisma.administrador.delete({
      where: { id },
    });
  }
}
