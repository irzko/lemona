import CreateCategoryForm from "./CreateCategoryForm";
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
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <CreateCategoryForm categories={categories} />
      </div>
    </main>
  );
}
