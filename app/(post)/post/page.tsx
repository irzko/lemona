import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import slugify from "slugify";
import Link from "next/link";
import Image from "next/image";

const getPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany();
  },
  ["posts"],
  { tags: ["posts"] },
);

export default async function Page() {
  const allPosts = await getPosts();
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-2">
        <h2>Bài viết mới</h2>
        <ul className="grid grid-cols-1 list-none sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
          {allPosts.map((post) => (
            <li className="border border-gray-200 overflow-hidden bg-white rounded-lg" key={post.id.toString()}>
              <Link
                className="text-gray-800 hover:no-underline"
                href={`/post/${slugify(post.title, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: false,
                  locale: "vi",
                  trim: true,
                })}-${post.id.toString()}.html`}
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={"/no-image.jpg"}
                    alt={post.title}
                    fill
                    className="object-contain rounded-b-lg"
                  />
                </div>

                <h6 className="p-2 flex justify-center items-center min-h-16">
                  {post.title}
                </h6>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
