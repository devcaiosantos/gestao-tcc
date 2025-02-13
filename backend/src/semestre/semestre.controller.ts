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
import { CreateSemestreDto } from "./dto/create-semestre.dto";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { SemestreDTO } from "./dto/semestre.dto";
import { ApiBearerAuth } from "@nestjs/swagger";

@ApiBearerAuth()
@ApiTags("Semestre")
@Controller("semestre")
export class SemestreController {
  constructor(private readonly semestreService: SemestreService) {}

  @ApiResponse({
    status: 200,
    description: "Semestre criado com sucesso",
    type: SemestreDTO,
  })
  @Post()
  create(@Body() semestreService: CreateSemestreDto) {
    return this.semestreService.create(semestreService);
  }

  @ApiResponse({
    status: 200,
    description: "Lista de semestres",
    type: [SemestreDTO],
  })
  @Get()
  findAll() {
    return this.semestreService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: "Semestre Atualizado com sucesso",
    type: SemestreDTO,
  })
  @Patch(":id")
  update(
    @Param("id") id: number,
    @Body() updateModeloTexto: CreateSemestreDto,
  ) {
    return this.semestreService.update(+id, updateModeloTexto);
  }

  @ApiResponse({
    status: 200,
    description: "Semestre deletado com sucesso",
    type: SemestreDTO,
  })
  @Delete(":id")
  remove(@Param("id") id: number) {
    return this.semestreService.remove(+id);
  }

  @ApiResponse({
    status: 200,
    description: "Semestre ativo",
    type: SemestreDTO,
  })
  @Get("ativo")
  findActiveSemester() {
    return this.semestreService.findActiveSemester();
  }
}
