import Markdown, { type Components } from "react-markdown";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
// import { MDXRemote } from "remote-mdx/rsc";
import remarkGfm from "remark-gfm";
import Image from "next/image";
import Link from "next/link";

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
    img({ alt, src }) {
      return (
        <Image
          alt={alt || ""}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          src={src || "./no-image.jpg"}
        />
      );
    },
    table({ children }) {
      return (
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            {children}
          </table>
        </div>
      );
    },
    thead({ children }) {
      return (
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          {children}
        </thead>
      );
    },
    th({ children }) {
      return (
        <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          {children}
        </th>
      );
    },
    td({ children }) {
      return (
        <td className="px-6 py-4">
          {children}
        </td>
      );
    },
    tr({ children }) {
      return (
        <tr className="border-b">
          {children}
        </tr>
      );
    },
    ul({ children }) {
      return (
        <ul className="space-y-1 text-gray-500 list-disc list-inside">
          {children}
        </ul>
      );
    },
    ol({ children }) {
      return (
        <ol className="space-y-1 text-gray-500 list-decimal list-inside">
          {children}
        </ol>
      );
    },
    li({ children }) {
      return <li>{children}</li>;
    },
    a({ href, children }) {
      return (
        <Link
          className="font-medium text-blue-600 hover:underline"
          href={href || ""}
        >
          {children}
        </Link>
      );
    },
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
