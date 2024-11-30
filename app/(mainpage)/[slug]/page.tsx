// import Markdown from "react-markdown";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { MDXRemote } from "remote-mdx/rsc";
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
      <div className="max-w-screen-lg w-full space-y-4 p-4">
        <h1>{post.title || "(No title)"}</h1>
        <time>{new Date(post.createdAt).toLocaleString()}</time>
        <MDXRemote
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [],
            },
          }}
          source={post.content || "(No content)"}
        />
        {/*<Markdown remarkPlugins={[[remarkGfm, { singleTilde: false }]]}>
          {post.content || "(No content)"}
        </Markdown>*/}
      </div>
    </main>
  );
}
