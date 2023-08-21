/*
  Warnings:

  - Added the required column `title` to the `sections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sections" ADD COLUMN     "title" TEXT NOT NULL;
