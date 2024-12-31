-- DropForeignKey
ALTER TABLE "educations" DROP CONSTRAINT "educations_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "work_experiences" DROP CONSTRAINT "work_experiences_resumeId_fkey";

-- AddForeignKey
ALTER TABLE "work_experiences" ADD CONSTRAINT "work_experiences_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "educations" ADD CONSTRAINT "educations_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
