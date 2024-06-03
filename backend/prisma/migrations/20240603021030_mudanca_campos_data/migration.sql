/*
  Warnings:

  - You are about to drop the column `createdAt` on the `administrador` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `administrador` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `modelo-texto` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `modelo-texto` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `professor` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `professor` table. All the data in the column will be lost.
  - Added the required column `dataAtualizacao` to the `administrador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataAtualizacao` to the `modelo-texto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataAtualizacao` to the `professor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "administrador" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "dataAtualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "modelo-texto" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "dataAtualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "professor" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "dataAtualizacao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
