import { Module } from "@nestjs/common";
import { ModeloTextoService } from "./modelo-texto.service";
import { ModeloTextoController } from "./modelo-texto.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ModeloTextoController],
  providers: [ModeloTextoService],
})
export class ModeloTextoModule {}
