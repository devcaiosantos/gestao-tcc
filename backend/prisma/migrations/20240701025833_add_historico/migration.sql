-- CreateEnum
CREATE TYPE "Etapa" AS ENUM ('TCC1', 'TCC2');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('matriculado', 'orientador_definido', 'banca_preenchida', 'banca_agendada', 'aprovado', 'reprovado', 'nao_finalizado');

-- CreateTable
CREATE TABLE "aluno" (
    "ra" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aluno_pkey" PRIMARY KEY ("ra")
);

-- CreateTable
CREATE TABLE "aluno-matriculado" (
    "id" SERIAL NOT NULL,
    "raAluno" TEXT NOT NULL,
    "etapa" "Etapa" NOT NULL,
    "status" "Status" NOT NULL,
    "idSemestre" INTEGER NOT NULL,
    "idOrientador" INTEGER,
    "idCoorientador" INTEGER,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aluno-matriculado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoricoAluno" (
    "id" SERIAL NOT NULL,
    "raAluno" TEXT NOT NULL,
    "idSemestre" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "observacao" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HistoricoAluno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "aluno_email_key" ON "aluno"("email");

-- CreateIndex
CREATE UNIQUE INDEX "aluno-matriculado_raAluno_etapa_idSemestre_key" ON "aluno-matriculado"("raAluno", "etapa", "idSemestre");

-- AddForeignKey
ALTER TABLE "aluno-matriculado" ADD CONSTRAINT "aluno-matriculado_raAluno_fkey" FOREIGN KEY ("raAluno") REFERENCES "aluno"("ra") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno-matriculado" ADD CONSTRAINT "aluno-matriculado_idSemestre_fkey" FOREIGN KEY ("idSemestre") REFERENCES "semestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno-matriculado" ADD CONSTRAINT "aluno-matriculado_idOrientador_fkey" FOREIGN KEY ("idOrientador") REFERENCES "professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno-matriculado" ADD CONSTRAINT "aluno-matriculado_idCoorientador_fkey" FOREIGN KEY ("idCoorientador") REFERENCES "professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoricoAluno" ADD CONSTRAINT "HistoricoAluno_raAluno_fkey" FOREIGN KEY ("raAluno") REFERENCES "aluno"("ra") ON DELETE CASCADE ON UPDATE CASCADE;
