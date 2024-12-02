"use server";
import prisma from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { createId } from "@paralleldrive/cuid2";
import { hash } from "argon2";
import slugify from "slugify";

import {
  SignupFormSchema,
  SignupFormState,
  CategoryFormState,
  CategoryFormSchema,
} from "@/lib/definitions";

export async function createPost(formData: FormData) {
  const title = formData.get("title") as string
  const tags = (formData.get("tags") as string).split(",").map((i) => i.trim());
  await prisma.post.create({
    data: {
      id: createId(),
      description: formData.get("description") as string,
      title,
      content: formData.get("content") as string,
      authorId: formData.get("authorId") as string,
      featuredImageURL: formData.get("featuredImageURL") as string,
      slug: slugify(title, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      }),
      categoryId: formData.get("categoryId") as string,
      tags: {
        create: tags.map((tagName) => ({
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
    },
  });

  revalidateTag("posts");
  redirect("/");
}

export async function updatePost(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const featuredImageURL = formData.get("featuredImageURL") as string;
  const tags = (formData.get("tags") as string).split(",").map((i) => i.trim());
  const id = formData.get("id") as string;
  const description = formData.get("description") as string;
  
  const existingTags = await prisma.tagsOnPosts.findMany({
    where: {
      postId: id,
    },
    select: {
      tag: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const unuseTags = existingTags.filter(tag => !tags.includes(tag.tag.name))
  const useTags = tags.filter(tag => !existingTags.map(tag => tag.tag.name).includes(tag))

  await prisma.post.update({
    where: {
      id,
    },
    data: {
      title,
      content,
      description,
      featuredImageURL,
      slug: slugify(title, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      }),
      categoryId: formData.get("categoryId") as string,
      tags: {
        deleteMany: unuseTags.map((tg) => ({
          postId: id,
          tagId: tg.tag.id,
        })),

        create: useTags.map((tagName) => ({
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
  formData: FormData,
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

  const category = await prisma.category.findFirst({
    where: {
      name: name,
    },
  });

  console.log(state);

  if (category) {
    return {
      errors: { name: ["Category already exists"] },
    };
  }
  const parentCategoryId = formData.get("parentCategoryId") as string;
  await prisma.category.create({
    data: {
      id: createId(),
      slug: slugify(name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      }),
      name,
      parentCategoryId,
    },
  });
  revalidateTag("categories");
  redirect("/admin/categories");
}

export async function updateCategory(
  state: CategoryFormState,
  formData: FormData,
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
      slug: slugify(name, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      }),
      name,
      parentCategoryId,
    },
  });
  revalidateTag("categories");
  redirect("/admin/categories");
}
