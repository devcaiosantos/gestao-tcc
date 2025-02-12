import { Body, Controller, Get, Post, Request } from "@nestjs/common";
import { AppService } from "./app.service";
import { Public } from "./auth/constants";
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ValidateStudentTokenDTO } from "./dto/validate-student-token.dto";
import { SendDirectMailDto } from "./dto/send-direct-mail.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @ApiExcludeEndpoint()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiBearerAuth()
  @ApiTags("E-mail")
  @ApiResponse({
    status: 200,
    description: "E-mail enviado com sucesso",
  })
  @Post("send-direct-mail")
  sendDirectMail(
    @Request() req,
    @Body() { destinatarios, assunto, texto }: SendDirectMailDto,
  ) {
    const admin = req.admin;
    return this.appService.sendDirectMail({
      admin,
      recipients: destinatarios,
      subject: assunto,
      text: texto,
    });
  }

  @ApiTags("Autenticação")
  @ApiResponse({
    status: 200,
    description: "Token válido",
  })
  @Public()
  @Post("validar-token-aluno")
  validateStudentToken(@Body() { status, token }: ValidateStudentTokenDTO) {
    return this.appService.validateStudentToken({
      status,
      studentToken: token,
    });
  }
}
