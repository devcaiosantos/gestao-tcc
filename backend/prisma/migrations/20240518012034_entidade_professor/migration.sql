-- CreateEnum
CREATE TYPE "Departamento" AS ENUM ('DACOM', 'DAAMB', 'DACOC', 'DAELN', 'DAAEQ', 'DAQUI', 'DABIC', 'DAFIS', 'DAGEE', 'DAHUM', 'DAMAT', 'OUTRO');

-- CreateTable
CREATE TABLE "professor" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "departamento" "Departamento" NOT NULL,

    CONSTRAINT "professor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professor_email_key" ON "professor"("email");
