import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const slug = params.slug;
  const data = await prisma.manga.findUnique({
    where: {
      id: parseInt(slug),
    },
    include: {
      genres: {
        select: {
          genre: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      chapters: {
        select: {
          id: true,
          orderNumber: true,
        },
        orderBy: {
          orderNumber: "asc",
        },
      },
    },
  });

  return Response.json(data);
}
