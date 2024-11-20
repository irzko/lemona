"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData:FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  await prisma.post.create({
    data: {
      title: title,
      content: content,
    },
  })!
  revalidateTag("posts");
  redirect("/");
}
