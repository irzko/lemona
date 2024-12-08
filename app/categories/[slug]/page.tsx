import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";

const getPosts = unstable_cache(
  async (slug: string) => {
    return prisma.category.findUnique({
      where: {
        slug,
      },
      include: {
        posts: {
          include: {
            post: true,
          },
        },
      },
    });
  },
  ["posts", "categories"],
  { tags: ["posts", "categories"] }
);
//   async (id: string) => {
//     return await prisma.category.findMany({
//       where: {
//         id,
//       },
//       orderBy: [
//         {
//           name: "asc",
//         },
//       ],
//     });
//   },
//   ["categories"],
//   { tags: ["categories"] }
// );

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const categoryId = (await params).slug;
  if (!categoryId) {
    return null;
  }
  // const categories = await getCategory(categoryId);
  const category = await getPosts(categoryId);

  if (!category) {
    return <div>Danh mục không tồn tại</div>;
  }

  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <ul className="grid grid-cols-1 mt-4 space-y-0 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {category.posts.map((categoriesOnPosts) => (
            <li
              className="overflow-hidden bg-white"
              key={categoriesOnPosts.post.id}
            >
              <Link
                className="text-gray-800 flex gap-4"
                href={`/${slugify(categoriesOnPosts.post.title, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: true,
                  locale: "vi",
                  trim: true,
                })}-${categoriesOnPosts.post.id}.html`}
              >
                <div className="w-2/5">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={
                        categoriesOnPosts.post.featuredImageURL ||
                        "/no-image.jpg"
                      }
                      alt={categoriesOnPosts.post.title}
                      unoptimized
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>

                <h6 className="font-semibold w-3/5 text-base line-clamp-3">
                  {categoriesOnPosts.post.title || "(No title)"}
                </h6>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
