import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const posts = await prisma.post.findMany();
  return NextResponse.json(posts);
}
