import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { config } from "dotenv";

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);

  const configSwagger = new DocumentBuilder()
    .setTitle("Documentação API Gestão TCC")
    .setVersion("1.0")
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger);
  SwaggerModule.setup("docs", app, documentFactory);

  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
