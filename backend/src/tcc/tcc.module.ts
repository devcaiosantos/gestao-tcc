import { Module } from "@nestjs/common";
import { TccController } from "./tcc.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { EnrollmentService } from "./enrollment.service";

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [TccController],
  providers: [EnrollmentService],
})
export class TccModule {}
