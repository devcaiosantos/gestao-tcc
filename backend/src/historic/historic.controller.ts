import { Controller, Get, Param } from "@nestjs/common";
import { HistoricService } from "./historic.service";

@Controller("historico")
export class HistoricController {
  constructor(private readonly historicService: HistoricService) {}

  @Get(":ra")
  async findByRA(@Param("ra") ra: string) {
    return this.historicService.findByRA(ra);
  }
}
