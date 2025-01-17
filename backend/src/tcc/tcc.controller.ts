import { Controller, Body, Post, Get, Param, Query, Put } from "@nestjs/common";
import { EnrollmentService } from "./enrollment.service";
import { EnrollStudent, Stage, Status } from "./interfaces";

@Controller("tcc")
export class TccController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get("/:stage")
  findEnrollmentsByIdSemester(
    @Param("stage") stage: Stage,
    @Query("idSemester") idSemester: string,
    @Query("status") status: string,
    @Query("term") term: string,
  ) {
    return this.enrollmentService.findEnrollmentsByIdSemester({
      stage,
      idSemester: +idSemester,
      status: status as Status,
      term,
    });
  }

  @Post("/:stage/matricular")
  enroll(@Param("stage") stage: Stage, @Body() student: EnrollStudent) {
    if (stage === "TCC1") {
      return this.enrollmentService.enrollTCC1({ stage, student });
    }
    if (stage === "TCC2") {
      return this.enrollmentService.enrollTCC2({ stage, student });
    }
  }

  @Post("/:stage/matricular-lote")
  enrollBatch(@Param("stage") stage: Stage, @Body() students: EnrollStudent[]) {
    if (stage === "TCC1") {
      return this.enrollmentService.enrollBatchTCC1(students);
    }
    if (stage === "TCC2") {
      return this.enrollmentService.enrollBatchTCC2(students);
    }
  }

  @Put("finalizar-semestre/:stage/:semesterId")
  finishSemester(
    @Param("stage") stage: Stage,
    @Param("semesterId") id: number,
  ) {
    return this.enrollmentService.finishSemester({ stage, semesterId: +id });
  }

  @Put("importar-matriculas/:stage/:semesterId")
  importEnrollmentsFromSemester(
    @Param("stage") stage: Stage,
    @Param("semesterId") idSemester: number,
  ) {
    return this.enrollmentService.importEnrollmentsFromSemester({
      stage,
      semesterId: +idSemester,
    });
  }
}
