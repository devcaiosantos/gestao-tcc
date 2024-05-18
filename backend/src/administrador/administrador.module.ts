import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AdministradorService } from "./administrador.service";
import { AdministradorController } from "./administrador.controller";

@Module({
  imports: [PrismaModule],
  controllers: [AdministradorController],
  providers: [AdministradorService],
})
export class AdministradorModule {}
