import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import Link from "next/link";
import Image from "next/image";

const getPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
})
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
        <ul className="grid grid-cols-2 space-y-0 list-none sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {allPosts.slice(0, 4).map((post) => (
            <li className="overflow-hidden bg-white" key={post.id}>
              <Link
                className="text-gray-800 hover:no-underline"
                href={`/post/${slugify(post.title, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: false,
                  locale: "vi",
                  trim: true,
                })}-${post.id}.html`}
              >
                <div className="relative w-full aspect-video">
                  <Image
                    src={"/no-image.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>

                <h6 className="py-2 font-semibold text-base line-clamp-3">
                  {post.title || "(No title)"}
                </h6>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-1 mt-4 space-y-0 list-none sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {allPosts.slice(4).map((post) => (
            <li className="overflow-hidden bg-white" key={post.id}>
              <Link
                className="text-gray-800 hover:no-underline flex gap-4"
                href={`/post/${slugify(post.title, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: false,
                  locale: "vi",
                  trim: true,
                })}-${post.id}.html`}
              >
                <div className="w-2/5">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={"/no-image.jpg"}
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
