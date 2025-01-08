/*
  Warnings:

  - You are about to drop the column `googleCredentials` on the `administrador` table. All the data in the column will be lost.
  - You are about to drop the column `googleToken` on the `administrador` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "administrador" DROP COLUMN "googleCredentials",
DROP COLUMN "googleToken";

-- CreateTable
CREATE TABLE "google_token" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "administradorId" INTEGER NOT NULL,

    CONSTRAINT "google_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "google_credentials" (
    "id" SERIAL NOT NULL,
    "clientId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "authUri" TEXT NOT NULL,
    "tokenUri" TEXT NOT NULL,
    "authProviderX509CertUrl" TEXT NOT NULL,
    "clientSecret" TEXT NOT NULL,
    "redirectUris" TEXT[],
    "administradorId" INTEGER NOT NULL,

    CONSTRAINT "google_credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "google_token_administradorId_key" ON "google_token"("administradorId");

-- CreateIndex
CREATE UNIQUE INDEX "google_credentials_administradorId_key" ON "google_credentials"("administradorId");

-- AddForeignKey
ALTER TABLE "google_token" ADD CONSTRAINT "google_token_administradorId_fkey" FOREIGN KEY ("administradorId") REFERENCES "administrador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "google_credentials" ADD CONSTRAINT "google_credentials_administradorId_fkey" FOREIGN KEY ("administradorId") REFERENCES "administrador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
