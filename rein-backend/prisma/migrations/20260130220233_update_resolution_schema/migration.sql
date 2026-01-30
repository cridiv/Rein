/*
  Warnings:

  - You are about to drop the column `goalDetails` on the `resolutions` table. All the data in the column will be lost.
  - You are about to drop the column `goalType` on the `resolutions` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `resolutions` table. All the data in the column will be lost.
  - Added the required column `goal` to the `resolutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roadmap` to the `resolutions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `resolutions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "resolutions" DROP COLUMN "goalDetails",
DROP COLUMN "goalType",
DROP COLUMN "plan",
ADD COLUMN     "goal" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "roadmap" JSONB NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
