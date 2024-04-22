import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AdministradorModule } from './administrador/administrador.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env ',
      isGlobal: true,
    }),
    AdministradorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
