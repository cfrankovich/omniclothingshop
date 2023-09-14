/*
  Warnings:

  - You are about to drop the column `forsale` on the `Garment` table. All the data in the column will be lost.
  - Added the required column `forSale` to the `Garment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Garment" DROP COLUMN "forsale",
ADD COLUMN     "forSale" BOOLEAN NOT NULL;
