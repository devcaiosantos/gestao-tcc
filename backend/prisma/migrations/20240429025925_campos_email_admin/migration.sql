/*
  Warnings:

  - Added the required column `email_sistema` to the `administrador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha_email_sistema` to the `administrador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "administrador" ADD COLUMN     "email_sistema" TEXT NOT NULL,
ADD COLUMN     "senha_email_sistema" TEXT NOT NULL;
