"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData:FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  console.log("8282828")
  await prisma.post.create({
    data: {
      title: title,
      content: content,
    },
  });
  console.log(`Created post with title: ${title}`);
  revalidateTag("post");
  redirect("/");
}
