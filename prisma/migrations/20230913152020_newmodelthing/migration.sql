/*
  Warnings:

  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Test` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "role";

-- DropTable
DROP TABLE "Test";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "Garment" (
    "id" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "color" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "forsale" BOOLEAN NOT NULL,

    CONSTRAINT "Garment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Garment_id_key" ON "Garment"("id");
