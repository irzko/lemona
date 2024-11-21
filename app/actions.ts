"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { hash } from "argon2";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorId = formData.get("authorId") as string;
  await prisma.post.create({
    data: {
      id: createId(),
      title,
      content,
      authorId,
    },
  });
  revalidateTag("posts");
  redirect("/");
}

export async function createUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const hashedPassword = await hash(password);
  await prisma.user.create({
    data: {
      id: createId(),
      username: username,
      password: hashedPassword,
    },
  });
  revalidateTag("users");
  redirect("/login");
}
