import PostForm from "@/components/post-form";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

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
export default async function Page() {
  const categories = await getCategories();
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="flex justify-center">
      <PostForm authorId={session.user.id as string} categories={categories} />
    </div>
  );
}
