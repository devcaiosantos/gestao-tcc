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
import {
  ApiBearerAuth,
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { EnrollmentDto } from "./dto/enrollment.dto";
import { CreateEnrollmentDto } from "./dto/create-enrollment.dto";
import { DefineAdvisorDTO } from "./dto/define-advisor.dto";
import { StudentDefineAdvisorDTO } from "./dto/student-define-advisor.dto";
import { DefineBoardDTO } from "./dto/define-board.dto";
import { StudentDefineBoardDTO } from "./dto/student-define-board.dto";
import { ScheduleBoardDTO } from "./dto/schedule-board.dto";
import { StudentScheduleBoardDTO } from "./dto/student-schedule-board.dto";
import { AssignGradeDTO } from "./dto/assign-grade.dto";

@ApiTags("TCC")
@ApiBearerAuth()
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
  @ApiQuery({ name: "term", required: false })
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

    throw {
      statusCode: 400,
      message: "Etapa inválida",
    };
  }

  @ApiResponse({
    status: 200,
    description: "Matrículas realizadas com sucesso",
    type: [EnrollmentDto],
  })
  @ApiBody({
    type: [CreateEnrollmentDto],
    description: "Lista de alunos a serem matriculados",
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
    description: "Semestre finalizado com sucesso",
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
      semesterId: +semesterId,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Orientador definido com sucesso",
  })
  @Post("definir-orientador/admin")
  defineAdvisor(
    @Body() { idMatricula, idOrientador, idCoorientador }: DefineAdvisorDTO,
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

  @ApiResponse({
    status: 200,
    description: "Orientador definido com sucesso",
  })
  @Public()
  @Post("definir-orientador/aluno")
  defineAdvisorByStudent(
    @Body() { idOrientador, idCoorientador, token }: StudentDefineAdvisorDTO,
  ) {
    return this.advisorService.studentDefineAdvisor({
      advisorId: idOrientador,
      coAdvisorId: idCoorientador,
      studentToken: token,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Orientador removido com sucesso",
  })
  @Delete("remover-orientador/:idMatricula")
  removeAdvisor(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.advisorService.removeAdvisor({
      enrollmentId: +idMatricula,
      adminName: admin.nome,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Banca definida com sucesso",
  })
  @Post("definir-banca/admin")
  defineBoard(
    @Body()
    { idMatricula, idMembros, titulo }: DefineBoardDTO,
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

  @ApiResponse({
    status: 200,
    description: "Banca alterada com sucesso",
  })
  @Put("alterar-banca/admin")
  adminUpdateBoard(
    @Body()
    { idMatricula, idMembros, titulo }: DefineBoardDTO,
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

  @ApiResponse({
    status: 200,
    description: "Banca removida com sucesso",
  })
  @Delete("remover-banca/:idMatricula")
  removeBoard(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.boardService.removeBoard({
      enrollmentId: +idMatricula,
      admin,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Banca definida com sucesso",
  })
  @Public()
  @Put("definir-banca/aluno")
  defineBoardByStudent(
    @Body() { idMembros, token, titulo }: StudentDefineBoardDTO,
  ) {
    return this.boardService.studentDefineBoard({
      membersIds: idMembros,
      studentToken: token,
      title: titulo,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Banca agendada com sucesso",
  })
  @Post("agendar-banca/admin")
  scheduleBoardByAdmin(
    @Body() { idMatricula, dataHorario, local }: ScheduleBoardDTO,
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

  @ApiResponse({
    status: 200,
    description: "Banca desmarcada com sucesso",
  })
  @Delete("desmarcar-banca/:idMatricula")
  unscheduleBoard(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.boardService.unscheduleBoard({
      enrollmentId: +idMatricula,
      admin,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Banca agendada com sucesso",
  })
  @Public()
  @Post("agendar-banca/aluno")
  scheduleBoardByStudent(
    @Body() { dataHorario, local, token }: StudentScheduleBoardDTO,
  ) {
    return this.boardService.studentScheduleBoard({
      schedule: dataHorario,
      location: local,
      studentToken: token,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Nota atribuída com sucesso",
  })
  @Post("atribuir-nota")
  grade(@Body() { idMatricula, nota }: AssignGradeDTO) {
    return this.boardService.assignGrade({
      enrollmentId: idMatricula,
      grade: nota,
    });
  }

  @ApiResponse({
    status: 200,
    description: "Nota removida com sucesso",
  })
  @Delete("remover-nota/:idMatricula")
  removeGrade(@Param("idMatricula") idMatricula: number) {
    return this.boardService.removeGrade(+idMatricula);
  }
}
