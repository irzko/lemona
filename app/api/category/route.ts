import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import buildCategoryTree from "@/lib/buildCategoryTree";



export const GET = async () => {
  const categoryTree = await prisma.category.findMany();
  return NextResponse.json(buildCategoryTree(categoryTree));
};
