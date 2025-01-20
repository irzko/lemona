import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";
import { Card, CardBody, CardFooter } from "@heroui/card";

const getPosts = unstable_cache(
  async () => {
    return await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        featuredImageURL: true,
        createdAt: true,
        author: {
          select: {
            name: true,
            username: true,
          },
        },
      },

      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
  ["posts"],
  { tags: ["posts"] }
);

export default async function Page() {
  const allPosts = await getPosts();
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <h3 className="text-xl font-semibold mb-4">Bài viết mới</h3>
        <div className="grid grid-cols sm:grid-cols-2 md:grid-cols-4 divide-y-1 sm:divide-y-0 gap-4">
          {allPosts.slice(0, 4).map((post) => (
            <div key={post.id} className="pt-4">
              <Link
                className="space-y-4"
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
                    unoptimized
                    className="object-cover rounded-xl"
                  />
                </div>
                <div className="flex flex-col">
                  <h4 className="font-semibold text-lg line-clamp-3">
                    {post.title || "(No title)"}
                  </h4>
                  <div className="space-x-2 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      by{" "}
                      {post.author?.name || post.author?.username || "Unknown"}
                    </span>
                    <span>-</span>
                    <span>
                      {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className="text-sm line-clamp-2">{post.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        <ul className="grid grid-cols-1 mt-4 space-y-0 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {allPosts.slice(4).map((post) => (
            <Card
              shadow="sm"
              as={Link}
              href={`/${slugify(post.title, {
                replacement: "-",
                remove: undefined,
                lower: true,
                strict: true,
                locale: "vi",
                trim: true,
              })}-${post.id}.html`}
              className="bg-white"
              isPressable
              key={post.id}
            >
              <CardBody className="relative w-full aspect-video">
                <Image
                  src={post.featuredImageURL || "/no-image.jpg"}
                  alt={post.title}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </CardBody>
              <CardFooter>
                <h3 className="font-bold mt-4 uppercase text-lg line-clamp-3">
                  {post.title || "(No title)"}
                </h3>
              </CardFooter>
            </Card>
          ))}
        </ul>
      </div>
    </main>
  );
}
