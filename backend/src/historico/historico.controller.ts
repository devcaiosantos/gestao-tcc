import { Controller, Get, Param } from "@nestjs/common";
import { HistoricoService } from "./historico.service";

@Controller("historico")
export class HistoricoController {
  constructor(private readonly historicoService: HistoricoService) {}

  @Get(":ra")
  async findByRA(@Param("ra") ra: string) {
    return this.historicoService.findByRA(ra);
  }
}
