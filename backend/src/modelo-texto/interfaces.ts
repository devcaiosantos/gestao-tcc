type TipoModeloTexto = "ATA" | "DECLARACAO" | "EMAIL";

export interface CreateModeloTexto {
  titulo: string;
  conteudo: string;
  tipo: TipoModeloTexto;
}
