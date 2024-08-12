import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  Query,
  Put,
  Req,
} from "@nestjs/common";
import { TCC1Service } from "./tcc1.service";
import { EnrollStudent, Status } from "./interfaces";
import { Public } from "../auth/constants";
@Controller("tcc1")
export class TCC1Controller {
  constructor(private readonly tcc1Service: TCC1Service) {}

  @Get("")
  findEnrollmentsByIdSemester(
    @Query("idSemester") idSemester: string,
    @Query("status") status: string,
    @Query("term") term: string,
  ) {
    return this.tcc1Service.findEnrollmentsByIdSemester({
      idSemester: +idSemester,
      status: status as Status,
      term,
    });
  }

  @Post("matricular")
  enroll(@Body() student: EnrollStudent) {
    return this.tcc1Service.enroll(student);
  }

  @Post("matricular-lote")
  enrollBatch(@Body() students: EnrollStudent[]) {
    return this.tcc1Service.enrollBatch(students);
  }

  @Delete("desmatricular/:id")
  unenroll(@Param("id") id: string) {
    return this.tcc1Service.unenroll(+id);
  }

  @Put("finalizar-semestre/:idSemestre")
  finishSemester(@Param("idSemestre") id: number) {
    return this.tcc1Service.finishSemester(+id);
  }

  @Put("importar-matriculas/:idSemestre")
  importEnrollments(@Param("idSemestre") id: number) {
    return this.tcc1Service.importEnrollmentsFromSemester(+id);
  }

  @Post("definir-orientador/admin")
  defineAdvisor(
    @Body() { idMatricula, idOrientador, idCoorientador },
    @Req() req,
  ) {
    const admin = req.admin;
    return this.tcc1Service.adminDefineAdvisor({
      enrollmentId: +idMatricula,
      advisorId: +idOrientador,
      coAdvisorId: idCoorientador,
      admin,
    });
  }

  @Public()
  @Post("definir-orientador/aluno")
  defineAdvisorByStudent(@Body() { idOrientador, idCoorientador, token }) {
    return this.tcc1Service.studentDefineAdvisor({
      advisorId: idOrientador,
      coAdvisorId: idCoorientador,
      studentToken: token,
    });
  }
}
