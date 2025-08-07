/*
  Warnings:

  - The `status` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER', 'SUPERVISOR', 'VISITOR', 'IT', 'SUPPORT', 'HR');

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "status",
ADD COLUMN     "status" "public"."UserRole" DEFAULT 'USER';
