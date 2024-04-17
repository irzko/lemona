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
  await prisma.chapter.create({
    data: data,
  });
  return Response.json({ message: "Chapter created" }, { status: 201 });
};

export const PUT = async (req: Request) => {
  const data = await req.json();
  await prisma.chapter.create({
    data: data,
  });
  return Response.json({ message: "Chapter updated" }, { status: 201 });
};

export const DELETE = async (req: Request) => {
  const data = await req.json();
  await prisma.chapter.delete({
    where: {
      id: data.id,
    },
  });
  return Response.json({ message: "Chapter deleted" }, { status: 200 });
};
