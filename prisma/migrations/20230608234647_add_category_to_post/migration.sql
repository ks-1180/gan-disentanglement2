/*
  Warnings:

  - You are about to drop the `Radar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RadarWalk` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RadarWalkScore` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Radar";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RadarWalk";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "RadarWalkScore";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Walk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "space" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "walk" INTEGER NOT NULL,
    "video" TEXT NOT NULL,
    "image" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Attribute" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "walkId" INTEGER NOT NULL,
    CONSTRAINT "Attribute_walkId_fkey" FOREIGN KEY ("walkId") REFERENCES "Walk" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Score" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "attributeId" INTEGER NOT NULL,
    "index" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    CONSTRAINT "Score_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "Attribute" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
