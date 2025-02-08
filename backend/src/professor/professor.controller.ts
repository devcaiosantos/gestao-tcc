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
import { ProfessorService } from "./professor.service";
import { Public } from "src/auth/constants";
import { CreateProfessorDto } from "./dto/create-professor.dto";
import { ProfessorDTO } from "./dto/professor.dto";
import { ApiResponse } from "@nestjs/swagger";
@Controller("professor")
export class ProfessorController {
  constructor(private readonly professorService: ProfessorService) {}

  @ApiResponse({
    status: 200,
    description: "Cria um professor",
    type: ProfessorDTO,
  })
  @Post()
  create(@Body() createProfessor: CreateProfessorDto) {
    return this.professorService.create(createProfessor);
  }

  @ApiResponse({
    status: 200,
    description: "Retorna todos os professores",
    type: [ProfessorDTO],
  })
  @Public()
  @Get()
  findAll() {
    return this.professorService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: "Retorna um professor",
    type: ProfessorDTO,
  })
  @Patch(":id")
  update(@Param("id") id: string, @Body() updateProfessor: CreateProfessorDto) {
    return this.professorService.update(+id, updateProfessor);
  }

  @ApiResponse({
    status: 200,
    description: "Remove um professor",
    type: ProfessorDTO,
  })
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.professorService.remove(+id);
  }

  @ApiResponse({
    status: 200,
    description: "Busca professores",
    type: [ProfessorDTO],
  })
  @Get("search")
  search(@Query("term") term: string) {
    return this.professorService.search(term);
  }
}
