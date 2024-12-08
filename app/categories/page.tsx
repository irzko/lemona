import prisma from "@/lib/prisma";
import { unstable_cache } from "next/cache";
import Link from "next/link";

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
        <ul className="grid grid-cols-2 space-y-0 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category) => {
            return (
              <li key={category.id}>
                <Link
                  className="p-4 bg-gray-100 rounded-lg"
                  href={`/categories/${category.slug}`}
                >
                  {category.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
