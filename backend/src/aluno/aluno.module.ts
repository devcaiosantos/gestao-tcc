import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { AlunoService } from "./aluno.service";
import { AlunoController } from "./aluno.controller";

@Module({
  imports: [PrismaModule],
  controllers: [AlunoController],
  providers: [AlunoService],
})
export class AlunoModule {}
