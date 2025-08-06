/*
  Warnings:

  - Added the required column `dailyROI` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `daysRemaining` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endDate` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextPayoutDate` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planType` to the `Investment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalEarnings` to the `Investment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
-- PRAGMA foreign_keys=OFF; -- Removed for compatibility with non-SQLite databases
CREATE TABLE "Investment_new" (
    "id" SERIAL PRIMARY KEY,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "dailyROI" DOUBLE PRECISION NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    "totalEarnings" DOUBLE PRECISION NOT NULL,
    "daysRemaining" INTEGER NOT NULL,
    "nextPayoutDate" TIMESTAMP NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);

INSERT INTO "Investment_new" ("id", "amount", "status", "planType", "dailyROI", "endDate", "totalEarnings", "daysRemaining", "nextPayoutDate", "createdAt", "userId")
SELECT "id", "amount", "status", "planType", "dailyROI", "endDate", "totalEarnings", "daysRemaining", "nextPayoutDate", "createdAt", "userId" FROM "Investment";

DROP TABLE "Investment";
ALTER TABLE "Investment_new" RENAME TO "Investment";