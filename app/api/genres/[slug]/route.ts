import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const data = await prisma.genre.findUnique({
    where: {
      id: parseInt(slug),
    },
    include: {
      mangas: {
        select: {
          mangaId: true,
          manga: {
            select: {
              title: true,
              imageCover: true,
            },
          },
        },
      },
    },
  });

  return Response.json(data);
}
