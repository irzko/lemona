import prisma from "@/lib/prisma";

export const GET = async (req: Request) => {
  const chapter = await prisma.chapter.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: 10,
    include: {
      manga: {
        select: {
          title: true,
        },
      },
    },
  });
  return Response.json(chapter, { status: 200 });
};

export const POST = async (req: Request) => {
  const data = await req.json();
  const chapter = await prisma.chapter.create({
    data: data,
  });
  await prisma.manga.update({
    where: {
      id: chapter.mangaId,
    },
    data: {
      updatedAt: new Date(),
    },
  });
  return Response.json({ message: "Chapter created" }, { status: 201 });
};
