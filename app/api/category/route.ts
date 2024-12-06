import prisma from "@/lib/prisma";
import { getCategoryTree } from "@prisma/client/sql";
import { NextResponse } from "next/server";

export const GET = async () => {
  const categoryTree = await prisma.$queryRawTyped(getCategoryTree());
  return NextResponse.json(categoryTree);
};
