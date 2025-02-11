import { Controller, Get, Param, Query } from "@nestjs/common";
import { AlunoService } from "./aluno.service";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AlunoDTO } from "./dto/aluno.dto";

@ApiTags("Aluno")
@Controller("aluno")
export class AlunoController {
  constructor(private readonly alunoService: AlunoService) {}

  @ApiResponse({
    status: 200,
    description: "Lista de alunos",
    type: [AlunoDTO],
  })
  @Get()
  findAll() {
    return this.alunoService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: "Aluno encontrado",
    type: AlunoDTO,
  })
  @Get("ra/:ra")
  findAlunoByRA(@Param("ra") ra: string) {
    return this.alunoService.findAlunoByRA(ra);
  }

  @ApiResponse({
    status: 200,
    description: "Lista de alunos encontrados com base no termo",
    type: [AlunoDTO],
  })
  @Get("search")
  search(@Query("term") term: string) {
    return this.alunoService.search(term);
  }
}
