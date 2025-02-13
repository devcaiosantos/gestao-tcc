import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { config } from "dotenv";
import { HttpExceptionFilter } from "./http-exception.filter";

async function bootstrap() {
  config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors();
  const configSwagger = new DocumentBuilder()
    .setTitle("Documentação API Gestão TCC")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const documentFactory = () =>
    SwaggerModule.createDocument(app, configSwagger, {
      autoTagControllers: false,
    });
  SwaggerModule.setup("docs", app, documentFactory);

  await app.listen(process.env.PORT);
}
bootstrap();
