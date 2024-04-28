import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdministradorController } from "./administrador/administrador.controller";
import { AdministradorService } from "./administrador/administrador.service";
import { PrismaService } from "./prisma.service";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env ",
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: "/api",
        module: AppModule,
      },
    ]),
  ],
  controllers: [AppController, AdministradorController],
  providers: [AppService, AdministradorService, PrismaService],
})
export class AppModule {}
