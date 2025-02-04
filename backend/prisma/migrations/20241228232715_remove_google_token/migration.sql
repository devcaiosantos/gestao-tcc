/*
  Warnings:

  - You are about to drop the `google_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "google_token" DROP CONSTRAINT "google_token_administradorId_fkey";

-- AlterTable
ALTER TABLE "google_credentials" ADD COLUMN     "refreshToken" TEXT;

-- DropTable
DROP TABLE "google_token";
