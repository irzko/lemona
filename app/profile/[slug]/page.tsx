import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";


const getUser = unstable_cache(
  async (username: string) => {
    return await prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        name: true,
        image: true,
        posts: true,
        role: true,
      },
    });
  },
  ["users"],
  { tags: ["users"] },
);

const getPosts = unstable_cache(
  async (authorId: string) => {
    return await prisma.post.findUnique({
      where: {
        authorId,
      },
      select: {
        id: true,
        title: true,
        featuredImageURL: true,
      },
    });
  },
  ["posts"],
  { tags: ["posts"] },
);

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  if (!slug) {
    return null;
  }
  const user = await getUser(slug);

  if (!user) {
    return (
      <main>
        <h2>404</h2>
      </main>
    );
  }
  
  const posts = await getPosts(user.id);
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full space-y-4 p-4">
        <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg border border-gray-200">
          <div className="relative w-32 h-32 overflow-hidden bg-gray-100 rounded-full">
            {user.image ? (
              <Image
                fill
                src={user.image}
                alt={user.name || user.username}
              ></Image>
            ) : (
              <svg
                className="absolute w-[136px] h-[136px] text-gray-400 -left-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            )}
          </div>
          <h4>{user.name || user.username}</h4>
        </div>
        <ul className="flex flex-col list-none gap-4">
                  {posts.map((post) => (
            <li className="overflow-hidden bg-white" key={post.id}>
              <Link
                className="text-gray-800 hover:no-underline flex gap-4"
                href={`/edit/${post.id}`}
              >
                <div className="w-2/5">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={post.featuredImageURL || "/no-image.jpg"}
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
