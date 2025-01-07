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
          <div>
            {user.image ? (
              <Image
                fill
                src={user.image}
                alt={user.name || user.username}
              ></Image>
            ) : (
              <svg
                className="w-32 h-32"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM11.9916 6.25C10.1958 6.25 8.73808 7.70407 8.73808 9.5C8.73808 11.2959 10.1958 12.75 11.9916 12.75C13.7875 12.75 15.2452 11.2959 15.2452 9.5C15.2452 7.70407 13.7875 6.25 11.9916 6.25ZM17.0409 16.4802C14.3735 13.6002 9.57472 13.7487 6.96382 16.4756L6.77631 16.6631C6.63104 16.8084 6.55172 17.0069 6.55688 17.2123C6.56204 17.4177 6.65122 17.612 6.8036 17.7498C8.17769 18.9923 10.0013 19.75 12.0001 19.75C13.9989 19.75 15.8225 18.9923 17.1966 17.7498C17.349 17.612 17.4382 17.4177 17.4433 17.2123C17.4485 17.0069 17.3692 16.8084 17.2239 16.6631L17.0409 16.4802Z"
                  fill="currentColor"
                ></path>
              </svg>
            )}
          </div>
          <h4>{user.name || user.username}</h4>
        </Card>
        <div className="grid sm:grid-cols-3 gap-4">
          {user.posts.map((post) => (
            <Card as={Link} href={`/edit/${post.id}`} key={post.id}>
              <CardBody>
                <div className="flex gap-4">
                  <div className="w-2/5">
                    <div className="relative w-full aspect-square">
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
