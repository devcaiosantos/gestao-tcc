/*
  Warnings:

  - Added the required column `senha` to the `administrador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "administrador" ADD COLUMN     "senha" TEXT NOT NULL;
