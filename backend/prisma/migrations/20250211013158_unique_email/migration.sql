/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `aluno` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "aluno_email_key" ON "aluno"("email");
