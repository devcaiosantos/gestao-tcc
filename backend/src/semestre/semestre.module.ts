import { Module } from "@nestjs/common";
import { SemestreService } from "./semestre.service";
import { SemestreController } from "./semestre.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [SemestreController],
  providers: [SemestreService],
})
export class SemestreModule {}
