import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { ProfessorService } from "./professor.service";
import { createProfessorProps } from "./interfaces";
@Controller("professor")
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @Post()
  create(@Body() createProfessor: createProfessorProps) {
    return this.professorService.create(createProfessor);
  }

  @Get()
  findAll() {
    return this.professorService.findAll();
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateProfessor: createProfessorProps,
  ) {
    return this.professorService.update(+id, updateProfessor);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.professorService.remove(+id);
  }
}
