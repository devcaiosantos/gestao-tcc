/*
  Warnings:

  - The primary key for the `semestre` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `semestre` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[ano,numero]` on the table `semestre` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ano` to the `semestre` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `semestre` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "semestre_id_key";

-- AlterTable
ALTER TABLE "semestre" DROP CONSTRAINT "semestre_pkey",
ADD COLUMN     "ano" INTEGER NOT NULL,
ADD COLUMN     "numero" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "ativo" SET DEFAULT false,
ADD CONSTRAINT "semestre_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "semestre_ano_numero_key" ON "semestre"("ano", "numero");

ALTER TABLE "semestre" 
ADD CONSTRAINT numero_check CHECK (numero IN (1, 2));