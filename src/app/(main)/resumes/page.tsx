import React from "react";
import { Metadata } from "next";
import { PlusSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import prisma from "@/lib/prisma";
// import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Your Resumes",
};

export default async function page() {
  const { userId } = await auth()
  if (!userId) return null;
  // const resumes = await prisma.resume.findMany({
  //   where: {
  //     userId,
  //   },
  //   orderBy: {
  //     updatedAt: "desc",
  //   },
  //   include: resumeDataInclude,
  // });

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-3 py-6">
      <Button asChild className="mx-auto flex w-fit gap-2">
        <Link href="/editor">
          <PlusSquare className="size-5" />
          New Resume
        </Link>
      </Button>
    </main>
  );
}
