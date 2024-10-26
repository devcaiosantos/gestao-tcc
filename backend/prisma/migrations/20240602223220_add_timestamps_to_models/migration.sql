/*
  Warnings:

  - Added the required column `updatedAt` to the `administrador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `modelo-texto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `professor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "administrador" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "modelo-texto" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "professor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
