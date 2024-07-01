/*
  Warnings:

  - You are about to drop the `HistoricoAluno` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HistoricoAluno" DROP CONSTRAINT "HistoricoAluno_raAluno_fkey";

-- DropTable
DROP TABLE "HistoricoAluno";

-- CreateTable
CREATE TABLE "historico-aluno" (
    "id" SERIAL NOT NULL,
    "raAluno" TEXT NOT NULL,
    "idSemestre" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "observacao" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico-aluno_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "historico-aluno" ADD CONSTRAINT "historico-aluno_raAluno_fkey" FOREIGN KEY ("raAluno") REFERENCES "aluno"("ra") ON DELETE CASCADE ON UPDATE CASCADE;
