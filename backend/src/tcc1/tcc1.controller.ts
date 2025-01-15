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

interface IDefineBoardByAdminBody {
  idMatricula: number;
  titulo: string;
  idMembros: number[];
}

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

  @Delete("remover-orientador/:idMatricula")
  removeAdvisor(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.tcc1Service.removeAdvisor({
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
    return this.tcc1Service.adminDefineBoard({
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
    return this.tcc1Service.adminUpdateBoard({
      title: titulo,
      enrollmentId: idMatricula,
      membersIds: idMembros,
      admin,
    });
  }

  @Delete("remover-banca/:idMatricula")
  removeBoard(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.tcc1Service.removeBoard({
      enrollmentId: +idMatricula,
      admin,
    });
  }

  @Public()
  @Put("definir-banca/aluno")
  defineBoardByStudent(@Body() { idMembros, token, titulo }) {
    return this.tcc1Service.studentDefineBoard({
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
    return this.tcc1Service.adminScheduleBoard({
      enrollmentId: idMatricula,
      schedule: dataHorario,
      location: local,
      admin,
    });
  }

  @Delete("desmarcar-banca/:idMatricula")
  unscheduleBoard(@Param("idMatricula") idMatricula: number, @Req() req) {
    const admin = req.admin;
    return this.tcc1Service.unscheduleBoard({
      enrollmentId: +idMatricula,
      admin,
    });
  }

  @Public()
  @Post("agendar-banca/aluno")
  scheduleBoardByStudent(@Body() { dataHorario, local, token }) {
    return this.tcc1Service.studentScheduleBoard({
      schedule: dataHorario,
      location: local,
      studentToken: token,
    });
  }

  @Post("atribuir-nota")
  grade(@Body() { idMatricula, nota }) {
    return this.tcc1Service.assignGrade({
      enrollmentId: idMatricula,
      grade: nota,
    });
  }

  @Delete("remover-nota/:idMatricula")
  removeGrade(@Param("idMatricula") idMatricula: number) {
    return this.tcc1Service.removeGrade(+idMatricula);
  }
}
