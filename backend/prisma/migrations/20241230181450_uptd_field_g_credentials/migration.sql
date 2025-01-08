/*
  Warnings:

  - You are about to drop the column `client_email` on the `google_credentials` table. All the data in the column will be lost.
  - Added the required column `clientEmail` to the `google_credentials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "google_credentials" DROP COLUMN "client_email",
ADD COLUMN     "clientEmail" TEXT NOT NULL;
