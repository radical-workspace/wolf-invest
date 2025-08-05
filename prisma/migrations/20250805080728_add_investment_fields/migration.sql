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
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Investment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL,
    "planType" TEXT NOT NULL,
    "dailyROI" REAL NOT NULL,
    "endDate" DATETIME NOT NULL,
    "totalEarnings" REAL NOT NULL,
    "daysRemaining" INTEGER NOT NULL,
    "nextPayoutDate" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Investment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Investment" ("amount", "createdAt", "id", "status", "userId") SELECT "amount", "createdAt", "id", "status", "userId" FROM "Investment";
DROP TABLE "Investment";
ALTER TABLE "new_Investment" RENAME TO "Investment";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
