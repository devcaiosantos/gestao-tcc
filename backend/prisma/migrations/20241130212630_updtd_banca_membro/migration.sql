/*
  Warnings:

  - Added the required column `dataAtualizacao` to the `banca_membro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isPresidente` to the `banca_membro` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banca_membro" ADD COLUMN     "dataAtualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isPresidente" BOOLEAN NOT NULL;
