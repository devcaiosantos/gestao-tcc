import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./auth/constants";
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post("send-direct-mail")
  sendDirectMail(@Request() req, @Body() { destinatarios, assunto, texto }) {
    const admin = req.admin;
    return this.appService.sendDirectMail({
      admin,
      recipients: destinatarios,
      subject: assunto,
      text: texto,
    });
  }

  @Public()
  @Post("validar-token-aluno")
  validateStudentToken(
    @Body() { status, token }: { status: string; token: string },
  ) {
    return this.appService.validateStudentToken({
      status,
      studentToken: token,
    });
  }
}
