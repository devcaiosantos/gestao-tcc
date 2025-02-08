type TipoModeloTexto = "ATA" | "DECLARACAO" | "EMAIL";

export class CreateModeloTextoDTO {
  /**
   * Título do modelo de texto
   * @example Ata de reunião
   */
  titulo: string;

  /**
   * Conteúdo do modelo de texto
   * @example Ata de reunião do dia 12/12/2020
   */
  conteudo: string;

  /**
   * Tipo do modelo de texto
   * @example ATA
   */
  tipo: TipoModeloTexto;
}
