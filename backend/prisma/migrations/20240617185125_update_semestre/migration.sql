/*
  Warnings:

  - You are about to drop the `Semestre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Semestre";

-- CreateTable
CREATE TABLE "semestre" (
    "id" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "semestre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "semestre_id_key" ON "semestre"("id");
