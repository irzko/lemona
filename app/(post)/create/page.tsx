import PostForm from "@/components/post-form";
import { auth } from "@/auth";
import { unstable_cacheTag as cacheTag } from "next/cache";
import prisma from "@/lib/prisma";

const getCategories = async () => {
  "use cache";
  cacheTag("categories");
  return await prisma.category.findMany({
    orderBy: [
      {
        name: "asc",
      },
    ],
  });
};
export default async function Page() {
  const categories = await getCategories();
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="flex justify-center">
      <div className="max-w-screen-lg w-full">
        <PostForm
          authorId={session.user.id as string}
          categories={categories}
        />
      </div>
    </div>
  );
}
