/*
  Warnings:

  - Added the required column `titulo` to the `banca` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banca" ADD COLUMN     "titulo" TEXT NOT NULL;
