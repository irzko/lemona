import CategoryList from "@/components/category/category-list";
import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getCategories = unstable_cache(
  async () => {
    return prisma.category.findMany({
      where: {
        parentCategoryId: null,
      },
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
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <h3 className="mb-4">Danh mục</h3>
        <CategoryList categories={categories} />
      </div>
    </main>
  );
}
