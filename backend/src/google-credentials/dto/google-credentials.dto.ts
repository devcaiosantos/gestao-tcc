import { CreateGoogleCredentialsDTO } from "./create-google-credentials.dto";

export class GoogleCredentialsDTO extends CreateGoogleCredentialsDTO {
  /**
   * Identificador da credencial
   * @example 1
   * @format int32
   */
  id: number;
}
