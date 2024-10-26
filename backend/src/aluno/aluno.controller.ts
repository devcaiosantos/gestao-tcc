import { Controller, Get, Param, Query } from "@nestjs/common";
import { AlunoService } from "./aluno.service";

@Controller("aluno")
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @Get()
  findAll() {
    return this.alunoService.findAll();
  }

  @Get("ra/:ra")
  findAlunoByRA(@Param("ra") ra: string) {
    return this.alunoService.findAlunoByRA(ra);
  }

  @Get("search")
  search(@Query("term") term: string) {
    return this.alunoService.search(term);
  }
}
