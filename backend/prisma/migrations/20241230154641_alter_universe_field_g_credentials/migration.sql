/*
  Warnings:

  - You are about to drop the column `universe_domain` on the `google_credentials` table. All the data in the column will be lost.
  - Added the required column `universeDomain` to the `google_credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "google_credentials" DROP COLUMN "universe_domain",
ADD COLUMN     "universeDomain" TEXT NOT NULL;
