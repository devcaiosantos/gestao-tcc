import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { SemestreService } from "./semestre.service";
import { CreateSemestre } from "./interfaces";

@Controller("semestre")
export class SemestreController {
  constructor(private readonly semestreService: SemestreService) {}

  @Post()
  create(@Body() semestreService: CreateSemestre) {
    return this.semestreService.create(semestreService);
  }

  @Get()
  findAll() {
    return this.semestreService.findAll();
  }

  @Patch(":id")
  update(@Param("id") id: number, @Body() updateModeloTexto: CreateSemestre) {
    return this.semestreService.update(+id, updateModeloTexto);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.semestreService.remove(+id);
  }

  @Get("ativo")
  findActiveSemester() {
    return this.semestreService.findActiveSemester();
  }
}
