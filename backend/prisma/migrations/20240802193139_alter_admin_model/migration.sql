/*
  Warnings:

  - You are about to drop the column `email_sistema` on the `administrador` table. All the data in the column will be lost.
  - You are about to drop the column `senha_email_sistema` on the `administrador` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "administrador" DROP COLUMN "email_sistema",
DROP COLUMN "senha_email_sistema",
ADD COLUMN     "chaveEmailSistema" TEXT,
ADD COLUMN     "emailSistema" TEXT;
