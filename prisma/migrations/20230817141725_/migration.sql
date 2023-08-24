-- CreateTable
CREATE TABLE "Session" (
    "sid" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "session" JSONB NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("sid")
);
