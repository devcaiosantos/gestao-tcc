import { Controller, Get, Param } from "@nestjs/common";
import { HistoricoService } from "./historico.service";
import { HistoricoDTO } from "./dto/historico.dto";
import { ApiResponse } from "@nestjs/swagger";
@Controller("historico")
export class HistoricoController {
  constructor(private readonly historicoService: HistoricoService) {}

  @ApiResponse({
    status: 200,
    description: "Lista de histórico do aluno",
    type: [HistoricoDTO],
  })
  @Get(":ra")
  async findByRA(@Param("ra") ra: string) {
    return this.historicoService.findByRA(ra);
  }
}
