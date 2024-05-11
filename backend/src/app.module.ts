import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AdministradorController } from "./administrador/administrador.controller";
import { AdministradorService } from "./administrador/administrador.service";
import { AuthController } from "./auth/auth.controller";
import { AuthService } from "./auth/auth.service";
import { PrismaService } from "./prisma.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./auth/auth.guard";
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
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: `${process.env.JWT_EXPIRES}s` },
    }),
  ],
  controllers: [AppController, AdministradorController, AuthController],
  providers: [
    AppService,
    PrismaService,
    AdministradorService,
    AuthService,
    JwtService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
