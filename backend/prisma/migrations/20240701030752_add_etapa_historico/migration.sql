/*
  Warnings:

  - Added the required column `etapa` to the `historico-aluno` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "historico-aluno" ADD COLUMN     "etapa" "Etapa" NOT NULL;
