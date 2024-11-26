import Markdown from "react-markdown";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import remarkGfm from "remark-gfm";


const getPost = unstable_cache(
  async (slug: string) => {
    return await prisma.post.findUnique({
      where: {
        slug,
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
  const post = await getPost(slug);

  if (!post) {
    return (
      <main>
        <h2>404</h2>
      </main>
    );
  }
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-4">
        <h1>{post.title || "(No title)"}</h1>
        <i>{new Date(post.createdAt).toLocaleString()}</i>
        <Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
          {post.content || "(No content)"}
        </Markdown>
      </div>
    </main>
  );
}
