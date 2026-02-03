-- CreateTable
CREATE TABLE "Resume" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Untitled Resume',
    "public" BOOLEAN NOT NULL DEFAULT false,
    "template" TEXT NOT NULL DEFAULT 'classic',
    "accentColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "professionalSummary" TEXT NOT NULL,
    "skills" TEXT[],
    "personalInfo" JSONB NOT NULL,
    "workExperience" JSONB[],
    "education" JSONB[],
    "projects" JSONB[],

    CONSTRAINT "Resume_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Resume" ADD CONSTRAINT "Resume_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
