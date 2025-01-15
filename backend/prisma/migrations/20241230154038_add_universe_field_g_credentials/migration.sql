/*
  Warnings:

  - You are about to drop the column `clientSecret` on the `google_credentials` table. All the data in the column will be lost.
  - You are about to drop the column `redirectUris` on the `google_credentials` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `google_credentials` table. All the data in the column will be lost.
  - You are about to drop the `aluno-matriculado` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `historico-aluno` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `modelo-texto` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientX509CertUrl` to the `google_credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_email` to the `google_credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privateKey` to the `google_credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `privateKeyId` to the `google_credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `google_credentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `universe_domain` to the `google_credentials` table without a default value. This is not possible if the table is not empty.

*/

-- DropForeignKey
ALTER TABLE "aluno-matriculado" DROP CONSTRAINT "aluno-matriculado_idCoorientador_fkey";

-- DropForeignKey
ALTER TABLE "aluno-matriculado" DROP CONSTRAINT "aluno-matriculado_idOrientador_fkey";

-- DropForeignKey
ALTER TABLE "aluno-matriculado" DROP CONSTRAINT "aluno-matriculado_idSemestre_fkey";

-- DropForeignKey
ALTER TABLE "aluno-matriculado" DROP CONSTRAINT "aluno-matriculado_raAluno_fkey";

-- DropForeignKey
ALTER TABLE "google_credentials" DROP CONSTRAINT "google_credentials_administradorId_fkey";

-- DropForeignKey
ALTER TABLE "historico-aluno" DROP CONSTRAINT "historico-aluno_raAluno_fkey";

-- DropIndex
DROP INDEX "google_credentials_clientId_key";

-- AlterTable
ALTER TABLE "google_credentials" DROP COLUMN "clientSecret",
DROP COLUMN "redirectUris",
DROP COLUMN "refreshToken",
ADD COLUMN     "clientX509CertUrl" TEXT NOT NULL,
ADD COLUMN     "client_email" TEXT NOT NULL,
ADD COLUMN     "privateKey" TEXT NOT NULL,
ADD COLUMN     "privateKeyId" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "universe_domain" TEXT NOT NULL;

-- DropTable
DROP TABLE "aluno-matriculado" CASCADE;

-- DropTable
DROP TABLE "historico-aluno";

-- DropTable
DROP TABLE "modelo-texto";

-- CreateTable
CREATE TABLE "modelo_texto" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "tipo" "TipoTexto" NOT NULL,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modelo_texto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aluno_matriculado" (
    "id" SERIAL NOT NULL,
    "raAluno" TEXT NOT NULL,
    "etapa" "Etapa" NOT NULL,
    "status" "Status" NOT NULL,
    "idSemestre" INTEGER NOT NULL,
    "idOrientador" INTEGER,
    "idCoorientador" INTEGER,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataAtualizacao" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "aluno_matriculado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historico_aluno" (
    "id" SERIAL NOT NULL,
    "raAluno" TEXT NOT NULL,
    "idSemestre" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "etapa" "Etapa" NOT NULL,
    "observacao" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_aluno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "modelo_texto_titulo_key" ON "modelo_texto"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "aluno_matriculado_raAluno_etapa_idSemestre_key" ON "aluno_matriculado"("raAluno", "etapa", "idSemestre");

-- AddForeignKey
ALTER TABLE "google_credentials" ADD CONSTRAINT "google_credentials_administradorId_fkey" FOREIGN KEY ("administradorId") REFERENCES "administrador"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_matriculado" ADD CONSTRAINT "aluno_matriculado_raAluno_fkey" FOREIGN KEY ("raAluno") REFERENCES "aluno"("ra") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_matriculado" ADD CONSTRAINT "aluno_matriculado_idSemestre_fkey" FOREIGN KEY ("idSemestre") REFERENCES "semestre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_matriculado" ADD CONSTRAINT "aluno_matriculado_idOrientador_fkey" FOREIGN KEY ("idOrientador") REFERENCES "professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aluno_matriculado" ADD CONSTRAINT "aluno_matriculado_idCoorientador_fkey" FOREIGN KEY ("idCoorientador") REFERENCES "professor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_aluno" ADD CONSTRAINT "historico_aluno_raAluno_fkey" FOREIGN KEY ("raAluno") REFERENCES "aluno"("ra") ON DELETE CASCADE ON UPDATE CASCADE;
