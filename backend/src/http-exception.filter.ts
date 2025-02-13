import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (typeof exception === "object" && exception.statusCode) {
      // Se a exceção já tem um statusCode, use os dados diretamente
      return response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        message: exception.message || "Erro desconhecido",
      });
    }

    // Se for uma exceção não reconhecida, trate como erro interno do servidor
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    return response.status(status).json({
      statusCode: status,
      message: exception.message || "Erro interno do servidor",
    });
  }
}
