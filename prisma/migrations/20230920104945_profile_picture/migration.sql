/*
  Warnings:

  - A unique constraint covering the columns `[profile_picture_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[profile_picture_id]` on the table `teachers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "profile_picture_id" INTEGER;

-- AlterTable
ALTER TABLE "teachers" ADD COLUMN     "profile_picture_id" INTEGER;

-- CreateTable
CREATE TABLE "ProfilePicture" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "ProfilePicture_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "students_profile_picture_id_key" ON "students"("profile_picture_id");

-- CreateIndex
CREATE UNIQUE INDEX "teachers_profile_picture_id_key" ON "teachers"("profile_picture_id");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_profile_picture_id_fkey" FOREIGN KEY ("profile_picture_id") REFERENCES "ProfilePicture"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teachers" ADD CONSTRAINT "teachers_profile_picture_id_fkey" FOREIGN KEY ("profile_picture_id") REFERENCES "ProfilePicture"("id") ON DELETE CASCADE ON UPDATE CASCADE;
