import { auth } from "@clerk/nextjs/server";
import ResumeEditor from "./ResumeEditor";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
export const metadata: Metadata = {
  title: "Design your resume",
};

interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}

export default async function page({ searchParams }: PageProps) {
  const { resumeId } = await searchParams;
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: {
          id: resumeId,
          userId,
        },
        include: resumeDataInclude,
      })
    : null;
  return (
    <div>
      <ResumeEditor resumeToEdit={resumeToEdit} />
    </div>
  );
}
