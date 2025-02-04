import { Module } from "@nestjs/common";
import { GoogleCredentialsController } from "./google-credentials.controller";
import { GoogleCredentialsService } from "./google-credentials.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [GoogleCredentialsController],
  providers: [GoogleCredentialsService],
})
export class GoogleCredentialsModule {}
