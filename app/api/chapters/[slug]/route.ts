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

  return Response.json(data);
}
