import { Module } from "@nestjs/common";
import { HistoricoController } from "./historico.controller";
import { HistoricoService } from "./historico.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [HistoricoController],
  providers: [HistoricoService],
})
export class HistoricoModule {}
