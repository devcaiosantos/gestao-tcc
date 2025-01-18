import { Module } from "@nestjs/common";
import { TccController } from "./tcc.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { EnrollmentService } from "./enrollment.service";
import { AdvisorService } from "./advisor.service";
import { BoardService } from "./board.service";

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [TccController],
  providers: [EnrollmentService, AdvisorService, BoardService],
})
export class TccModule {}
