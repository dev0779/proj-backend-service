-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('OPEN', 'CLOSED', 'INPROGRESS', 'CANCELED', 'WAITING');

-- CreateTable
CREATE TABLE "public"."Ticket" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SampleTickets" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."Status" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "SampleTickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SampleUsers" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "SampleUsers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SampleUsers_userId_key" ON "public"."SampleUsers"("userId");

-- AddForeignKey
ALTER TABLE "public"."SampleTickets" ADD CONSTRAINT "SampleTickets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."SampleUsers"("userId") ON DELETE SET NULL ON UPDATE CASCADE;
