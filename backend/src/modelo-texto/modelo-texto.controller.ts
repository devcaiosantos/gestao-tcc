import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ModeloTextoService } from "./modelo-texto.service";
import { CreateModeloTextoDTO } from "./dto/create-modelo-texto.dto";
import { ApiResponse } from "@nestjs/swagger";
import { ModeloTextoDTO } from "./dto/modelo-texto.dto";

@Controller("modelo-texto")
export class ModeloTextoController {
  constructor(private readonly modeloTextoService: ModeloTextoService) {}

  @ApiResponse({
    status: 201,
    description: "Modelo de texto criado com sucesso",
    type: ModeloTextoDTO,
  })
  @Post()
  create(@Body() createModeloTexto: CreateModeloTextoDTO) {
    return this.modeloTextoService.create(createModeloTexto);
  }

  @ApiResponse({
    status: 200,
    description: "Retorna todos os modelos de texto",
    type: [ModeloTextoDTO],
  })
  @Get()
  findAll() {
    return this.modeloTextoService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: "Retorna um modelo de texto",
    type: ModeloTextoDTO,
  })
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateModeloTexto: CreateModeloTextoDTO,
  ) {
    return this.modeloTextoService.update(+id, updateModeloTexto);
  }

  @ApiResponse({
    status: 200,
    description: "Modelo de texto deletado com sucesso",
    type: ModeloTextoDTO,
  })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.modeloTextoService.remove(+id);
  }

  @ApiResponse({
    status: 200,
    description: "Retorna modelos de texto que contém o termo pesquisado",
    type: [ModeloTextoDTO],
  })
  @Get("search")
  search(@Query("term") term: string) {
    return this.modeloTextoService.search(term);
  }
}
