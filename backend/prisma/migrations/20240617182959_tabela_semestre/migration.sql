-- CreateTable
CREATE TABLE "Semestre" (
    "id" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,

    CONSTRAINT "Semestre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Semestre_id_key" ON "Semestre"("id");
