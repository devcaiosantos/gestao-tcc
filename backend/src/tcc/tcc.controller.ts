import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  Query,
  Put,
  Delete,
  Req,
} from "@nestjs/common";
import { EnrollmentService } from "./enrollment.service";
import { AdvisorService } from "./advisor.service";
import { BoardService } from "./board.service";
import { Stage, Status } from "./interfaces";
import { Public } from "src/auth/constants";
import { ApiResponse } from "@nestjs/swagger";
import { EnrollmentDto } from "./dto/enrollment.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";

interface IDefineBoardByAdminBody {
  idMatricula: number;
  titulo: string;
  idMembros: number[];
}

@Controller("tcc")
export class TccController {
  constructor(
    private readonly enrollmentService: EnrollmentService,
    private readonly advisorService: AdvisorService,
    private readonly boardService: BoardService,
  ) {}

  @ApiResponse({
    status: 200,
    description: "Lista de matrículas",
    type: [EnrollmentDto],
  })
  @Get("/:etapa")
  findEnrollmentsByIdSemester(
    @Param("etapa") etapa: Stage,
    @Query("idSemester") idSemester: string,
    @Query("status") status: string,
    @Query("term") term: string,
  ) {
    return this.enrollmentService.findEnrollmentsByIdSemester({
      stage: etapa,
      idSemester: +idSemester,
      status: status as Status,
      term,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Matrícula realizada com sucesso",
    type: EnrollmentDto,
  })
  @Post("/:etapa/matricular")
  enroll(@Param("etapa") etapa: Stage, @Body() student: CreateEnrollmentDto) {
    if (etapa === "TCC1") {
      return this.enrollmentService.enrollTCC1({ stage: etapa, student });
    }
    if (etapa === "TCC2") {
      return this.enrollmentService.enrollTCC2({ stage: etapa, student });
    }
  }

  @ApiResponse({
    status: 200,
    description: "Matrículas realizadas com sucesso",
    type: [EnrollmentDto],
  })
  @Post("/:etapa/matricular-lote")
  enrollBatch(
    @Param("etapa") etapa: Stage,
    @Body() students: CreateEnrollmentDto[],
  ) {
    if (etapa === "TCC1") {
      return this.enrollmentService.enrollBatchTCC1(students);
    }
    if (etapa === "TCC2") {
      return this.enrollmentService.enrollBatchTCC2(students);
    }
  }

  @ApiResponse({
    status: 200,
    description: "Matrícula deletada com sucesso",
    type: EnrollmentDto,
  })
  @Delete("desmatricular/:id")
  unenroll(@Param("id") id: string) {
    return this.enrollmentService.unenroll(+id);
  }

  @ApiResponse({
    status: 200,
    description: "Semente finalizado com sucesso",
  })
  @Put("finalizar-semestre/:etapa/:idSemestre")
  finishSemester(
    @Param("etapa") etapa: Stage,
    @Param("idSemestre") id: number,
  ) {
    return this.enrollmentService.finishSemester({
      stage: etapa,
      semesterId: +id,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Matrículas importadas com sucesso",
  })
  @Put("importar-matriculas/:etapa/:idSemestre")
  importEnrollmentsFromSemester(
    @Param("etapa") stage: Stage,
    @Param("idSemestre") semesterId: number,
  ) {
    return this.enrollmentService.importEnrollmentsFromSemester({
      stage,
      semesterId,
    });
  }

  @Post("definir-orientador/admin")
  defineAdvisor(
    @Body() { idMatricula, idOrientador, idCoorientador },
    @Req() req,
  ) {
    const admin = req.admin;
    return this.advisorService.adminDefineAdvisor({
      enrollmentId: +idMatricula,
      advisorId: +idOrientador,
      coAdvisorId: +idCoorientador,
      admin,
    });
  }

  @Public()
  @Post("definir-orientador/aluno")
  defineAdvisorByStudent(@Body() { idOrientador, idCoorientador, token }) {
    return this.advisorService.studentDefineAdvisor({
      advisorId: idOrientador,
      coAdvisorId: idCoorientador,
      studentToken: token,
    });
  }

  @Delete("remover-orientador/:idMatricula")
  removeAdvisor(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.advisorService.removeAdvisor({
      enrollmentId: +idMatricula,
      adminName: admin.nome,
    });
  }

  @Post("definir-banca/admin")
  defineBoard(
    @Body()
    { idMatricula, idMembros, titulo }: IDefineBoardByAdminBody,
    @Req() req,
  ) {
    const admin = req.admin;
    return this.boardService.adminDefineBoard({
      enrollmentId: idMatricula,
      membersIds: idMembros,
      title: titulo,
      admin,
    });
  }

  @Put("alterar-banca/admin")
  adminUpdateBoard(
    @Body()
    { idMatricula, idMembros, titulo }: IDefineBoardByAdminBody,
    @Req() req,
  ) {
    const admin = req.admin;
    return this.boardService.adminUpdateBoard({
      title: titulo,
      enrollmentId: idMatricula,
      membersIds: idMembros,
      admin,
    });
  }

  @Delete("remover-banca/:idMatricula")
  removeBoard(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.boardService.removeBoard({
      enrollmentId: +idMatricula,
      admin,
    });
  }

  @Public()
  @Put("definir-banca/aluno")
  defineBoardByStudent(@Body() { idMembros, token, titulo }) {
    return this.boardService.studentDefineBoard({
      membersIds: idMembros,
      studentToken: token,
      title: titulo,
    });
  }

  @Post("agendar-banca/admin")
  scheduleBoardByAdmin(
    @Body() { idMatricula, dataHorario, local },
    @Req() req,
  ) {
    const admin = req.admin;
    return this.boardService.adminScheduleBoard({
      enrollmentId: idMatricula,
      schedule: dataHorario,
      location: local,
      admin,
    });
  }

  @Delete("desmarcar-banca/:idMatricula")
  unscheduleBoard(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.boardService.unscheduleBoard({
      enrollmentId: +idMatricula,
      admin,
    });
  }

  @Public()
  @Post("agendar-banca/aluno")
  scheduleBoardByStudent(@Body() { dataHorario, local, token }) {
    return this.boardService.studentScheduleBoard({
      schedule: dataHorario,
      location: local,
      studentToken: token,
    });
  }

  @Post("atribuir-nota")
  grade(@Body() { idMatricula, nota }) {
    return this.boardService.assignGrade({
      enrollmentId: idMatricula,
      grade: nota,
    });
  }

  @Delete("remover-nota/:idMatricula")
  removeGrade(@Param("idMatricula") idMatricula: number) {
    return this.boardService.removeGrade(+idMatricula);
  }
}
