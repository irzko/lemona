"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { hash } from "argon2";
import {
  SignupFormSchema,
  SignupFormState,
  CreateCategoryFormState,
  CreateCategoryFormSchema,
} from "@/lib/definitions";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const authorId = formData.get("authorId") as string;
  const featuredImageURL = formData.get("featuredImageURL") as string;
  await prisma.post.create({
    data: {
      id: createId(),
      title,
      content,
      authorId,
      featuredImageURL,
    },
  });

  revalidateTag("posts");
  redirect("/post");
}

export async function createUser(state: SignupFormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log(state);

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const hashedPassword = await hash(password);
  await prisma.user.create({
    data: {
      id: createId(),
      username,
      passwordHash: hashedPassword,
    },
  });
  revalidateTag("users");
  redirect("/login");
}

export async function createCategory(
  state: CreateCategoryFormState,
  formData: FormData,
) {
  const validatedFields = CreateCategoryFormSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const name = formData.get("name") as string;

  const category = await prisma.category.findFirst({
    where: {
      name: name,
    },
  });

  console.log(state);

  if (category) {
    return {
      errors: { name: "Category already exists" },
    };
  }
  const parentCategoryId = formData.get("parentCategoryId") as string;
  await prisma.category.create({
    data: {
      id: createId(),
      name,
      parentCategoryId,
    },
  });
  revalidateTag("categories");
  redirect("/admin/categories");
}
