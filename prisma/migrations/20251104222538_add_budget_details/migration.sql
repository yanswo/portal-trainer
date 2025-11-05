/*
  Warnings:

  - You are about to drop the column `companyName` on the `BudgetRequest` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BudgetRequest" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "courseId" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEIVED',
    "proposedFee" DECIMAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "demandType" TEXT NOT NULL DEFAULT 'IMMEDIATE',
    "certificateFormat" TEXT NOT NULL DEFAULT 'DIGITAL',
    CONSTRAINT "BudgetRequest_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BudgetRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_BudgetRequest" ("certificateFormat", "courseId", "createdAt", "demandType", "id", "notes", "proposedFee", "seats", "status", "updatedAt", "userId") SELECT "certificateFormat", "courseId", "createdAt", "demandType", "id", "notes", "proposedFee", "seats", "status", "updatedAt", "userId" FROM "BudgetRequest";
DROP TABLE "BudgetRequest";
ALTER TABLE "new_BudgetRequest" RENAME TO "BudgetRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
