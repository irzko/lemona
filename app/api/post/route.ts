import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  const posts = await prisma.post.findMany();
  const postsData = posts.map((post) => ({
    ...post,
    id: post.id.toString(),
  }));
  return NextResponse.json(postsData);
};
