import EditCategoryForm from "../EditCategoryForm";
import { auth } from "@/auth";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

const getCategory = unstable_cache(
  async (id: string) => {
    return await prisma.category.findUnique({
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
  const categoryId = (await params).slug;
  if (!categoryId) {
    return null;
  }
  const category = await getCategory(categoryId);
  const categories = await getCategories();
  const session = await auth();

  if (!session?.user) return null;
  if (!category) {
    return <div>Danh mục không tồn tại</div>;
  }

  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <EditCategoryForm allCategories={categories} category={category} />
      </div>
    </main>
  );
}
