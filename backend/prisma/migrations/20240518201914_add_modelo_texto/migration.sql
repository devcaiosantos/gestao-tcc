-- CreateEnum
CREATE TYPE "TipoTexto" AS ENUM ('ATA', 'EMAIL', 'DECLARACAO');

-- CreateTable
CREATE TABLE "modelo-texto" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipo" "TipoTexto" NOT NULL,

    CONSTRAINT "modelo-texto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modelo-texto_titulo_key" ON "modelo-texto"("titulo");
