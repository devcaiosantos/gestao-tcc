import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Get,
} from "@nestjs/common";
import { AdministradorService } from "./administrador.service";
import { createAdministradorProps, resetPasswordProps } from "./interfaces";
import { Public } from "src/auth/constants";

@Controller("administrador")
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}
  @Public()
  @Post()
  create(@Body() adminstrador: createAdministradorProps) {
    return this.administradorService.create(adminstrador);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.administradorService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() adminstrador: createAdministradorProps,
  ) {
    return this.administradorService.update(+id, adminstrador);
  }

  @Patch(":id/reset-password")
  resetPassword(
    @Param("id") id: string,
    @Body() adminstrador: resetPasswordProps,
  ) {
    return this.administradorService.resetPassword(+id, adminstrador);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.administradorService.remove(+id);
  }
}
