/*
  Warnings:

  - You are about to drop the column `status` on the `banca` table. All the data in the column will be lost.
  - You are about to drop the column `isPresidente` on the `banca_membro` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "banca" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "banca_membro" DROP COLUMN "isPresidente";

-- DropEnum
DROP TYPE "StatusBanca";
