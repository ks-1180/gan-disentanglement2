-- CreateTable
CREATE TABLE "Radar" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "direction" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "RadarWalk" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "radarId" INTEGER NOT NULL,
    "direction" TEXT NOT NULL,
    "steps" INTEGER NOT NULL,
    "from" REAL NOT NULL,
    "to" REAL NOT NULL,
    CONSTRAINT "RadarWalk_radarId_fkey" FOREIGN KEY ("radarId") REFERENCES "Radar" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RadarWalkScore" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "radarWalkId" INTEGER NOT NULL,
    "score" REAL NOT NULL,
    CONSTRAINT "RadarWalkScore_radarWalkId_fkey" FOREIGN KEY ("radarWalkId") REFERENCES "RadarWalk" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Radar_direction_key" ON "Radar"("direction");
