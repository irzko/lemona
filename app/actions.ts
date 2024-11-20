"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation"
  import { createId } from '@paralleldrive/cuid2';

export async function createPost(formData:FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  await prisma.post.create({
    data: {
      id: createId(),
      title: title,
      content: content,
    },
  })!
  revalidateTag("posts");
  redirect("/");
}
