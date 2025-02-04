-- CreateEnum
CREATE TYPE "StatusBanca" AS ENUM ('definida', 'agendada');

-- CreateTable
CREATE TABLE "banca" (
    "id" SERIAL NOT NULL,
    "dataHorario" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "local" TEXT,
    "nota" DOUBLE PRECISION,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,
    "idAlunoMatriculado" INTEGER NOT NULL,

    CONSTRAINT "banca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banca_membro" (
    "id" SERIAL NOT NULL,
    "bancaId" INTEGER NOT NULL,
    "professorId" INTEGER NOT NULL,
    "isPresidente" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "banca_membro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banca_idAlunoMatriculado_key" ON "banca"("idAlunoMatriculado");

-- CreateIndex
CREATE UNIQUE INDEX "banca_membro_bancaId_professorId_key" ON "banca_membro"("bancaId", "professorId");

-- AddForeignKey
ALTER TABLE "banca" ADD CONSTRAINT "banca_idAlunoMatriculado_fkey" FOREIGN KEY ("idAlunoMatriculado") REFERENCES "aluno-matriculado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banca_membro" ADD CONSTRAINT "banca_membro_bancaId_fkey" FOREIGN KEY ("bancaId") REFERENCES "banca"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banca_membro" ADD CONSTRAINT "banca_membro_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
