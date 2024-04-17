import prisma from "@/lib/prisma";

export const POST = async (req: Request) => {
  const data = await req.json();
  await prisma.chapter.create({
    data: data,
  });
  return Response.json({ message: "Chapter created" }, { status: 201 });
};
