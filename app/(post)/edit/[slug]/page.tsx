import EditPostForm from "@/components/edit-post-form";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const getPost = unstable_cache(
  async (id: string) => {
    return await prisma.post.findUnique({
      where: {
        id,
      },
    });
  },
  ["posts"],
  { tags: ["posts"] },
);

const getCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: [
        {
          name: "asc",
        },
      ],
    });
  },
  ["categories"],
  { tags: ["categories"] },
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const postId = (await params).slug.split(".")[0].split("-").pop();
  if (!postId) {
    return null;
  }
  const post = await getPost(postId);
  const categories = await getCategories();
  const session = await auth();

  if (!session?.user) return null;

  if (!post) {
    return (
      <main>
        <h2>404</h2>
      </main>
    );
  }
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <EditPostForm
          authorId={session.user.id as string}
          categories={categories}
          post={post}
        />
      </div>
    </main>
  );
}
