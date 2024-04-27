import { Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { AdministradorController } from "src/administrador/administrador.controller";
import { AdministradorService } from "src/administrador/administrador.service";
import { PrismaService } from "src/prisma.service";
@Module({
  controllers: [ApiController, AdministradorController],
  providers: [AdministradorService, PrismaService],
})
export class ApiModule {}
