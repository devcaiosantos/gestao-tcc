import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { AdministradorService } from "./administrador.service";
import { createAdministradorProps } from "./interfaces";

@Controller("administrador")
export class AdministradorController {
  constructor(private readonly administradorService: AdministradorService) {}

  @Post()
  create(@Body() adminstrador: createAdministradorProps) {
    return this.administradorService.create(adminstrador);
  }

  @Get()
  findAll() {
    return this.administradorService.findAll();
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

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.administradorService.remove(+id);
  }
}
