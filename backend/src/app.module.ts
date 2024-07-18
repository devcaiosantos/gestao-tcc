import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { PrismaService } from "./prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
import { ProfessorModule } from "./professor/professor.module";
import { AdministradorModule } from "./administrador/administrador.module";
import { ModeloTextoModule } from "./modelo-texto/modelo-texto.module";
import { SemestreModule } from "./semestre/semestre.module";
import { TCC1Module } from "./tcc1/tcc1.module";
import { HistoricModule } from "./historic/historic.module";
import { AlunoModule } from "./aluno/aluno.module";
import * as moment from "moment-timezone";

// Definindo o fuso horário para o Brasil
moment.tz.setDefault("America/Sao_Paulo");
console.log(new Date().toLocaleString());
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: "/api",
        module: AppModule,
        children: [
          {
            path: "/",
            module: AdministradorModule,
          },
          {
            path: "/",
            module: ProfessorModule,
          },
          {
            path: "/",
            module: ModeloTextoModule,
          },
          {
            path: "/",
            module: SemestreModule,
          },
          {
            path: "/",
            module: TCC1Module,
          },
          {
            path: "/",
            module: HistoricModule,
          },
          {
            path: "/",
            module: AlunoModule,
          },
        ],
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES}s` },
    }),
    ProfessorModule,
    AdministradorModule,
    ModeloTextoModule,
    SemestreModule,
    TCC1Module,
    HistoricModule,
    AlunoModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    PrismaService,
    AuthService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
