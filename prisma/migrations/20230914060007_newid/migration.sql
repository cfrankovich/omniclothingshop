/*
  Warnings:

  - The primary key for the `Garment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Garment` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropIndex
DROP INDEX "Garment_id_key";

-- AlterTable
ALTER TABLE "Garment" DROP CONSTRAINT "Garment_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Garment_pkey" PRIMARY KEY ("id");
