import CreateCategoryForm from "./CreateCategoryForm";
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
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <CreateCategoryForm categories={categories} />
      </div>
    </main>
  );
}
