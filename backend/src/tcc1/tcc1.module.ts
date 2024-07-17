import { Module } from "@nestjs/common";
import { TCC1Service } from "./tcc1.service";
import { TCC1Controller } from "./tcc1.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [TCC1Controller],
  providers: [TCC1Service],
})
export class TCC1Module {}
