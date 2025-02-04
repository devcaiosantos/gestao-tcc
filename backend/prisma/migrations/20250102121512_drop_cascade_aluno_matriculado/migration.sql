-- AddForeignKey
ALTER TABLE "banca" ADD CONSTRAINT "banca_idAlunoMatriculado_fkey" FOREIGN KEY ("idAlunoMatriculado") REFERENCES "aluno_matriculado"("id") ON DELETE CASCADE ON UPDATE CASCADE;
