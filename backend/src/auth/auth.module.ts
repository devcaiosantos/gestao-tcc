import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module"; // Ajuste o caminho conforme necessário
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

@Module({
  imports: [PrismaModule], // Importe o módulo que fornece PrismaService
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
