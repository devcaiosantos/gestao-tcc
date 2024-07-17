import { Controller, Post, Body, Get, Param, Delete } from "@nestjs/common";
import { TCC1Service } from "./tcc1.service";
import { EnrollStudent } from "./interfaces";

@Controller("tcc1")
export class TCC1Controller {
  constructor(private readonly tcc1Service: TCC1Service) {}

  @Get(":idSemester")
  findEnrollmentsByIdSemester(@Param("idSemester") idSemester: string) {
    return this.tcc1Service.findEnrollmentsByIdSemester(+idSemester);
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
}
