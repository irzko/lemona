import EditCategoryForm from "../EditCategoryForm";
import { auth } from "@/auth";
import { unstable_cacheTag as cacheTag } from "next/cache";
import prisma from "@/lib/prisma";

const getCategory = async (id: string) => {
  "use cache";
  cacheTag("categories");
  return await prisma.category.findUnique({
    where: {
      id,
    },
  });
};

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
