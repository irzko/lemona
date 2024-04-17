import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const recentlyUpdated = await prisma.manga.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 12,
  });

  const latest = await prisma.manga.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  return Response.json({
    recentlyUpdated,
    latest,
  });
}
