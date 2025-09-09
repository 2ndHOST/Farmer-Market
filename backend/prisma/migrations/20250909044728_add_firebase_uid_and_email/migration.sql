/*
  Warnings:

  - You are about to drop the `OtpCode` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "email" TEXT;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "OtpCode";
PRAGMA foreign_keys=on;
