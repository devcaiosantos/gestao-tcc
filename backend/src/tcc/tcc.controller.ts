import { Controller, Body, Post, Get, Param, Query } from "@nestjs/common";
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
}
