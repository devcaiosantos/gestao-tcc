export class CreateGoogleCredentialsDTO {
  /**
   * Tipo
   * @example "service_account"
   * @format string
   */
  type: string;

  /**
   * ID do projeto
   * @example "123456"
   * @format string
   */
  projectId: string;

  /**
   * ID da chave privada
   * @example "123456"
   *
   * @format string
   */
  privateKeyId: string;

  /**
   * Chave privada
   * @example "-----BEGIN PRIVATE
   * @format string
   * KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZ8vJ9
   * ...
   * \n-----END
   *  PRIVATE KEY
   * @format string
   * -----"
   */
  privateKey: string;

  /**
   * Email do cliente
   * @example
   * @format string
   */
  clientEmail: string;

  /**
   * ID do cliente
   * @example
   * @format string
   */
  clientId: string;

  /**
   * URI de autenticação
   * @example
   * @format string
   */
  authUri: string;

  /**
   * URI do token
   * @example
   * @format string
   */
  tokenUri: string;

  /**
   * URL do certificado de autenticação
   * @example
   * @format string
   */

  authProviderX509CertUrl: string;

  /**
   * URL do certificado do cliente
   * @example
   * @format string
   */

  clientX509CertUrl: string;

  /**
   * @example 1
   * @format int32
   */
  administradorId: number;
}
