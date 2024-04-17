import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;

  const data = await prisma.chapter.findUnique({
    where: {
      id: parseInt(slug),
    },
    include: {
      manga: {
        select: {
          title: true,
        },
      },
    },
  });

  if (!data) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const previousChapter = await prisma.chapter.findFirst({
    where: {
      mangaId: data.mangaId,
      orderNumber: data.orderNumber - 1,
    },
    select: {
      id: true,
      orderNumber: true,
    },
  });

  const nextChapter = await prisma.chapter.findFirst({
    where: {
      mangaId: data.mangaId,
      orderNumber: data.orderNumber + 1,
    },
    select: {
      id: true,
      orderNumber: true,
    },
  });

  return Response.json({ ...data, previousChapter, nextChapter });
}
