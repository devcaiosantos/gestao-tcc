export class ResetPasswordDTO {
  /**
   * Senha do usuário
   * @example 123456teste
   */
  senha: string;

  /**
   * Nova senha do usuário
   * @example teste123456
   */
  novaSenha: string;
}
