import prisma from "@/lib/prisma";
import { Button } from "@heroui/button";
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              as={Link}
              href={`/category/${category.slug}`}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </main>
  );
}
