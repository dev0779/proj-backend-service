-- CreateTable
CREATE TABLE "public"."users" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "first_name" VARCHAR(50),
    "last_name" VARCHAR(50),
    "username" VARCHAR(50),
    "email" VARCHAR(100),
    "password" VARCHAR(100),
    "status" VARCHAR(20),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_userId_key" ON "public"."users"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");
