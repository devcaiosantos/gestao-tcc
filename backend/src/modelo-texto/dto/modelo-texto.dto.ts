type TipoModeloTexto = "ATA" | "DECLARACAO" | "EMAIL";

export class ModeloTextoDTO {
  /**
   * ID do modelo de texto
   * @example 1
   */
  id: number;

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
