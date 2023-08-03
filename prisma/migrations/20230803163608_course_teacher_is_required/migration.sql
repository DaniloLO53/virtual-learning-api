/*
  Warnings:

  - Made the column `teacher_id` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "teacher_id" SET NOT NULL;
