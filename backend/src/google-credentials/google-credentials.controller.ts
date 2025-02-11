import { Controller, Post, Body, Req, Get, Delete, Put } from "@nestjs/common";
import { GoogleCredentialsService } from "./google-credentials.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { GoogleCredentialsDTO } from "./dto/google-credentials.dto";
@ApiTags("Credenciais Google")
@Controller("google-credentials")
export class GoogleCredentialsController {
  constructor(private readonly googleAuthService: GoogleCredentialsService) {}

  @ApiResponse({
    status: 200,
    description: "Credenciais criadas com sucesso",
    type: GoogleCredentialsDTO,
  })
  @Post()
  async create(@Body() credentials: GoogleCredentialsDTO, @Req() req) {
    const adminId = req.admin.id;
    return this.googleAuthService.create({
      adminId: adminId,
      credentials: credentials,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Credenciais encontradas",
    type: GoogleCredentialsDTO,
  })
  @Get()
  async get(@Req() req) {
    const adminId = req.admin.id;
    return this.googleAuthService.get(adminId);
  }

  @ApiResponse({
    status: 200,
    description: "Credenciais deletadas",
    type: GoogleCredentialsDTO,
  })
  @Delete()
  async delete(@Req() req) {
    const adminId = req.admin.id;
    return this.googleAuthService.delete(adminId);
  }

  @ApiResponse({
    status: 200,
    description: "Credenciais atualizadas",
    type: GoogleCredentialsDTO,
  })
  @Put()
  async update(@Body() credentials: GoogleCredentialsDTO, @Req() req) {
    const adminId = req.admin.id;
    return this.googleAuthService.update({
      adminId: adminId,
      credentials: credentials,
    });
  }
}
