"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { init, createId } from "@paralleldrive/cuid2";
import { hash } from "argon2";
import slugify from "slugify";

import {
  SignupFormSchema,
  SignupFormState,
  CategoryFormState,
  CategoryFormSchema,
} from "@/lib/definitions";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string;
  const tagNames = (formData.get("tagNames") as string)
    .split(",")
    .map((i) => i.trim());
  const categoryIds = JSON.parse(
    formData.get("categoryIds") as string
  ) as string[];

  const cuid = init({ length: 12 });
  await prisma.post.create({
    data: {
      id: cuid(),
      description: formData.get("description") as string,
      title,
      content: formData.get("content") as string,
      authorId: formData.get("authorId") as string,
      featuredImageURL: formData.get("featuredImageURL") as string,
      tags: {
        create: tagNames.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: {
                name: tagName,
              },
              create: {
                name: tagName,
                id: createId(),
              },
            },
          },
        })),
      },
      categories: {
        create: categoryIds.map((categoryId) => ({
          category: {
            connect: {
              id: categoryId,
            },
          },
        })),
      },
    },
  });

  revalidateTag("posts");
  redirect("/");
}

export async function updatePost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const featuredImageURL = formData.get("featuredImageURL") as string;
  const tagNames = (formData.get("tagNames") as string)
    .split(",")
    .map((i) => i.trim());
  const id = formData.get("id") as string;
  const description = formData.get("description") as string;
  const categoryIds = JSON.parse(
    formData.get("categoryIds") as string
  ) as string[];

  await prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      description,
      featuredImageURL,
      tags: {
        deleteMany: {},
        create: tagNames.map((tagName) => ({
          tag: {
            connectOrCreate: {
              where: {
                name: tagName,
              },
              create: {
                name: tagName,
                id: createId(),
              },
            },
          },
        })),
      },
      categories: {
        deleteMany: {},
        create: categoryIds.map((categoryId) => ({
          category: {
            connect: {
              id: categoryId,
            },
          },
        })),
      },
    },
  });

  revalidateTag("posts");
  redirect("/");
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
  redirect("/auth/login");
}

export async function createCategory(
  state: CategoryFormState,
  formData: FormData
) {
  const validatedFields = CategoryFormSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  console.log(state);

  const name = formData.get("name") as string;

  const category = await prisma.category.findFirst({
    where: {
      name: name,
    },
  });

  if (category) {
    return {
      errors: { name: ["Category already exists"] },
    };
  }
  const parentCategoryId = (formData.get("parentCategoryId") as string) || null;
  await prisma.category.create({
    data: {
      id: createId(),
      name,
      slug: slugify(name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      }),
      parentCategoryId,
    },
  });
  revalidateTag("categories");
  redirect("/dashboard/categories");
}

export async function updateCategory(
  state: CategoryFormState,
  formData: FormData
) {
  const validatedFields = CategoryFormSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const name = formData.get("name") as string;
  const id = formData.get("id") as string;

  console.log(state);

  const parentCategoryId = formData.get("parentCategoryId") as string;
  await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      slug: slugify(name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      }),
      parentCategoryId,
    },
  });
  revalidateTag("categories");
  redirect("/dashboard/categories");
}
