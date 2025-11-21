-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('LOCKED', 'CONFIRMED', 'CANCELLED', 'EXPIRED', 'RELEASED');

-- CreateTable
CREATE TABLE "reservations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "journeyId" TEXT NOT NULL,
    "seatIds" TEXT[],
    "fromStationId" TEXT NOT NULL,
    "toStationId" TEXT NOT NULL,
    "status" "ReservationStatus" NOT NULL DEFAULT 'LOCKED',
    "lockExpiry" TIMESTAMP(3) NOT NULL,
    "totalFare" DOUBLE PRECISION NOT NULL,
    "lockId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "reservations_lockId_key" ON "reservations"("lockId");

-- CreateIndex
CREATE INDEX "reservations_userId_idx" ON "reservations"("userId");

-- CreateIndex
CREATE INDEX "reservations_journeyId_idx" ON "reservations"("journeyId");

-- CreateIndex
CREATE INDEX "reservations_lockId_idx" ON "reservations"("lockId");

-- CreateIndex
CREATE INDEX "reservations_status_idx" ON "reservations"("status");

-- CreateIndex
CREATE INDEX "reservations_lockExpiry_idx" ON "reservations"("lockExpiry");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "journeys"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_fromStationId_fkey" FOREIGN KEY ("fromStationId") REFERENCES "stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_toStationId_fkey" FOREIGN KEY ("toStationId") REFERENCES "stations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
