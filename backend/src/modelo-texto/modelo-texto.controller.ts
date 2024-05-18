import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ModeloTextoService } from "./modelo-texto.service";
import { CreateModeloTexto } from "./interfaces";

@Controller("modelo-texto")
export class ModeloTextoController {
  constructor(private readonly modeloTextoService: ModeloTextoService) {}

  @Post()
  create(@Body() createModeloTexto: CreateModeloTexto) {
    return this.modeloTextoService.create(createModeloTexto);
  }

  @Get()
  findAll() {
    return this.modeloTextoService.findAll();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateModeloTexto: CreateModeloTexto,
  ) {
    return this.modeloTextoService.update(+id, updateModeloTexto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.modeloTextoService.remove(+id);
  }
}
