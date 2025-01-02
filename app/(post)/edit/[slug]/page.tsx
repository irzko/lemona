import EditPostForm from "@/components/post/edit-post-form";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import {
  Post,
  TagsOnPosts,
  Tag,
  Category,
  CategoriesOnPosts,
} from "@prisma/client";

const getPost = unstable_cache(
  async (id: string) => {
    return await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
        categories: {
          include: {
            category: true,
          },
        },
      },
    });
  },
  ["posts"],
  { tags: ["posts"] }
);

const getCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
  },
  ["categories"],
  { tags: ["categories"] }
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const postId = (await params).slug;
  if (!postId) {
    return null;
  }
  const post = await getPost(postId);
  const categories = await getCategories();
  const session = await auth();

  if (!session?.user) return null;
  if (!post) {
    return <div>Bài viết không tồn tại</div>;
  }

  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <EditPostForm
          authorId={session.user.id as string}
          categories={categories}
          post={
            post as unknown as Post & {
              tags: TagsOnPosts & { tag: Tag }[];
              categories: CategoriesOnPosts & { category: Category }[];
            }
          }
        />
      </div>
    </main>
  );
}
