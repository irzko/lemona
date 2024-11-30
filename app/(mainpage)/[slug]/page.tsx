import Markdown, { type Components } from "react-markdown";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
// import { MDXRemote } from "remote-mdx/rsc";
import remarkGfm from "remark-gfm";
import Image, { ImageProps } from "next/image";

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

const components: Components = {
  img(props) {
    return (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(props as ImageProps)}
      />
    );
  },
  table(props) {
    const { children, ...rest } = props;
    return (
      <div className="relative overflow-x-auto">
        <table
          className="w-full text-sm text-left rtl:text-right text-gray-500"
          {...rest}
        >
          {children}
        </table>
      </div>
    );
  },
  thead(props) {
    const { children, ...rest } = props;
    return <thead className="text-xs text-gray-700 uppercase bg-gray-50" {...rest}>{children}</thead>
  },
  /*th(props) {
    const { children, ...rest } = props;
    return <th className="px-6 py-3" {...rest}>{children}</th>
  }*/
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
        {/*<MDXRemote
          options={{
            mdxOptions: {
              remarkPlugins: [],
              rehypePlugins: [],
            },
          }}
          source={post.content || "(No content)"}
        />*/}
        <Markdown
          components={components}
          remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        >
          {post.content || "(No content)"}
        </Markdown>
      </div>
    </main>
  );
}
