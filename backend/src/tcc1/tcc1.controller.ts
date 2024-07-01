import { Controller, Post, Body } from "@nestjs/common";
import { TCC1Service } from "./tcc1.service";
import { EnrollStudent } from "./interfaces";

@Controller("tcc1")
export class TCC1Controller {
  constructor(private readonly tcc1Service: TCC1Service) {}

  @Post("matricular")
  enroll(@Body() student: EnrollStudent) {
    return this.tcc1Service.enroll(student);
  }
  @Post("matricular-lote")
  enrollBatch(@Body() students: EnrollStudent[]) {
    return this.tcc1Service.enrollBatch(students);
  }
}
