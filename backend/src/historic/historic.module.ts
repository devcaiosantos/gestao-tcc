import { Module } from "@nestjs/common";
import { HistoricController } from "./historic.controller";
import { HistoricService } from "./historic.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [HistoricController],
  providers: [HistoricService],
})
export class HistoricModule {}
