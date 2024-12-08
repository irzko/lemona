import { unstable_cacheTag as cacheTag } from "next/cache";
import prisma from "@/lib/prisma";
import Link from "next/link";

const getCategories = async () => {
  "use cache";
  cacheTag("categories");
  return await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      parentCategoryId: true,
    },
    orderBy: [
      {
        createdAt: "desc",
      },
    ],
  });
};

export default async function Page() {
  const allCategories = await getCategories();
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <h3 className="mb-4">Bài viết mới</h3>
        <ul className="grid grid-cols-2 space-y-0 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {allCategories.map((category) => {
            return (
              <li className="p-4 bg-gray-100" key={category.id}>
                <Link href={`/dashboard/categories/edit/${category.id}`}>
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
