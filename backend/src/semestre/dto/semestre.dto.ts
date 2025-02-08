import { CreateSemestreDto } from "./create-semestre.dto";
export class SemestreDTO extends CreateSemestreDto {
  /**
   * Identificador do semestre
   * @example 1
   * @format int32
   */
  id: number;
}
