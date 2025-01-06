import prisma from "@/lib/prisma";
import { Card, CardBody } from "@nextui-org/card";
import Image from "next/image";
import Link from "next/link";

const getUser = async (username: string) => {
  return await prisma.user.findUnique({
    where: {
      username,
    },

    include: {
      posts: {
        select: {
          id: true,
          title: true,
          featuredImageURL: true,
        },
      },
    },
  });
};

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

  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full space-y-4 p-4">
        <Card>
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
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
          </div>
          <h4>{user.name || user.username}</h4>
        </Card>
        <div className="flex flex-col gap-4">
          {user.posts.map((post) => (
            <Card as={Link} href={`/edit/${post.id}`} key={post.id}>
              <CardBody>
                <div className="flex gap-4">
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
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
