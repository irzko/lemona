import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const data = await prisma.manga.findMany({
    include: {
      genres: {
        select: {
          genre: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return Response.json(data);
}
