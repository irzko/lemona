import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: Request) => {
  const genres = await prisma.genre.findMany();
  return NextResponse.json(
    {
      data: genres,
    },
    {
      status: 200,
    }
  );
};

export const POST = async (req: NextRequest) => {
  const genre = await req.json();
  await prisma.genre.create({
    data: genre,
  });
  return NextResponse.json(
    { message: "Thêm thể loại thành công!" },
    { status: 201 }
  );
};
