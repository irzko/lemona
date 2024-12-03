import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

const getPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImageURL: true,
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
        <ul className="grid grid-cols space-y-0 list-none sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {allPosts.slice(0, 4).map((post) => (
            <li className="overflow-hidden bg-white shadow-md" key={post.id}>
              <Link className="text-gray-800" href={`/${post.slug}`}>
                <div className="relative w-full h-auto">
                  <div className="relative z-10 w-full aspect-video">
                    <Image
                      src={post.featuredImageURL || "/no-image.jpg"}
                      alt={post.title}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <div className="absolute z-0 inset-0 w-full aspect-video">
                    <Image
                      className="object-cover rounded-xl filter blur-lg scale-105 saturate-150 opacity-30 translate-y-1"
                      src={post.featuredImageURL || "/no-image.jpg"}
                      alt={post.title}
                      priority={false}
                      fill
                    />
                  </div>
                </div>

                <h6 className="pt-2 font-semibold text-base line-clamp-3">
                  {post.title || "(No title)"}
                </h6>
              </Link>
            </li>
          ))}
        </ul>
        <ul className="grid grid-cols-1 mt-4 space-y-0 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {allPosts.slice(4).map((post) => (
            <li className="overflow-hidden bg-white" key={post.id}>
              <Link className="text-gray-800 flex gap-4" href={`/${post.slug}`}>
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
