/*
  Warnings:

  - A unique constraint covering the columns `[clientId]` on the table `google_token` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "google_token_clientId_key" ON "google_token"("clientId");
