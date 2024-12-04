import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";

const getPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        featuredImageURL: true,
        createdAt: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
  ["posts"],
  { tags: ["posts"] },
);

export default async function Page() {
  const allPosts = await getPosts();
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <h3 className="mb-4">Bài viết mới</h3>
        <ul className="grid grid-cols divide-y-2 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {allPosts.slice(0, 4).map((post) => (
            <li
              className="bg-white pt-4"
              key={post.id}
            >
              <Link
                href={`/${slugify(post.title, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: true,
                  locale: "vi",
                  trim: true,
                })}-${post.id}.html`}
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={post.featuredImageURL || "/no-image.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="">
                  <h3 className="font-bold text-lg line-clamp-3">
                    {post.title || "(No title)"}
                  </h3>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-1 mt-4 space-y-0 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {allPosts.slice(4).map((post) => (
            <li className="overflow-hidden bg-white" key={post.id}>
              <Link
                className="text-gray-800 flex gap-4"
                href={`/${slugify(post.title, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: true,
                  locale: "vi",
                  trim: true,
                })}-${post.id}.html`}
              >
                <div className="w-2/5">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={post.title || "/no-image.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>

                <h6 className="font-semibold w-3/5 text-base line-clamp-3">
                  {post.title || "(No title)"}
                </h6>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
