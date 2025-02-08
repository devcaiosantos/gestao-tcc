import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
  Headers,
} from "@nestjs/common";
import { AdministradorService } from "./administrador.service";
import { Public } from "src/auth/constants";
import { ApiResponse } from "@nestjs/swagger";
import { CreateAdministradorDto } from "./dto/create-administrador.dto";
import { AdministradorDto } from "./dto/administrador.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
@Controller("administrador")
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  @ApiResponse({
    status: 200,
    description: "Cria um administrador",
    type: CreateAdministradorDto,
  })
  @Public()
  @Post()
  create(
    @Body() adminstrador: CreateAdministradorDto,
    @Headers("apikey") apiKey: string,
  ) {
    if (apiKey !== process.env.API_KEY) {
      throw {
        statusCode: 401,
        message: "Não foi possível criar usuário",
      };
    }
    return this.administradorService.create(adminstrador);
  }

  @ApiResponse({
    status: 200,
    description: "Retorna o administrador",
    type: AdministradorDto,
  })
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.administradorService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: "Atualiza o administrador",
    type: AdministradorDto,
  })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() adminstrador: CreateAdministradorDto,
  ) {
    return this.administradorService.update(+id, adminstrador);
  }

  @ApiResponse({
    status: 200,
    description: "Reseta a senha do administrador",
    type: AdministradorDto,
  })
  @Patch(":id/reset-password")
  resetPassword(
    @Param("id") id: string,
    @Body() adminstrador: ResetPasswordDTO,
  ) {
    return this.administradorService.resetPassword(+id, adminstrador);
  }

  @ApiResponse({
    status: 200,
    description: "Remove o administrador",
    type: AdministradorDto,
  })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.administradorService.remove(+id);
  }
}
