/*
  Warnings:

  - You are about to drop the column `courseId` on the `activities` table. All the data in the column will be lost.
  - Added the required column `course_id` to the `activities` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "activities" DROP CONSTRAINT "activities_courseId_fkey";

-- AlterTable
ALTER TABLE "activities" DROP COLUMN "courseId",
ADD COLUMN     "course_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
