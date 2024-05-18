import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ProfessorService } from "./professor.service";
import { ProfessorController } from "./professor.controller";

@Module({
  imports: [PrismaModule],
  controllers: [ProfessorController],
  providers: [ProfessorService],
})
export class ProfessorModule {}
