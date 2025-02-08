import { ApiProperty } from "@nestjs/swagger";

export class CreateEnrollmentDto {
  @ApiProperty({ example: "123456" })
  ra: string;

  @ApiProperty({ example: "Fulano de Tal" })
  nome: string;

  @ApiProperty({ example: "fulano@tal.com" })
  email: string;
}
