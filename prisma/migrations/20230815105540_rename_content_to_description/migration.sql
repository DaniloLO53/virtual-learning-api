/*
  Warnings:

  - You are about to drop the column `content` on the `courses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "content",
ADD COLUMN     "description" TEXT;
