import Markdown, { type Components } from "react-markdown";
import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
// import { MDXRemote } from "remote-mdx/rsc";
import remarkGfm from "remark-gfm";
import emoji from "remark-emoji";
import supersub from "remark-supersub";
import remarkIns from "remark-ins";
import Image from "next/image";
import Link from "next/link";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightLines from "rehype-highlight-code-lines";

//import hljs from 'highlight.js';
import "highlight.js/styles/github.min.css";

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
  h1({ children }) {
    return <h1 className="text-4xl">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="text-3xl font-medium">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-2xl font-medium">{children}</h3>;
  },
  h4({ children }) {
    return <h4 className="text-lg font-medium">{children}</h4>;
  },
  h5({ children }) {
    return <h5 className="text-sm font-medium">{children}</h5>;
  },

  h6({ children }) {
    return <h6 className="text-xs font-medium">{children}</h6>;
  },
  strong({ children }) {
    return <strong className="font-bold">{children}</strong>;
  },
  u({ children }) {
    return <u className="underline">{children}</u>;
  },
  em({ children }) {
    return <em className="italic">{children}</em>;
  },
  p({ children }) {
    return <p className="text-gray-500">{children}</p>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="p-4 my-4 border-s-4 border-gray-300 bg-gray-50">
        {children}
      </blockquote>
    );
  },

  /*
  pre({ children }) {
    return (
      <pre className="border text-sm rounded-lg p-2.5 bg-gray-50 border-gray-200 overflow-x-auto">
        {children}
      </pre>
    );
  },
*/

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
    return <td className="px-6 py-4">{children}</td>;
  },
  tr({ children }) {
    return <tr className="border-b">{children}</tr>;
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
        <h1 className="text-4xl font-medium">{post.title || "(No title)"}</h1>
        <time>{new Date(post.createdAt).toLocaleString()}</time>
        <p>
          <strong className="font-semibold text-gray-900">
            {post.description}
          </strong>
        </p>
        <Markdown
          components={components}
          rehypePlugins={[
            [rehypeHighlight],
            [
              rehypeHighlightLines,
              {
                showLineNumbers: true,
              },
            ],
          ]}
          remarkPlugins={[
            [remarkGfm, { singleTilde: false }],
            [emoji, { emoticon: true }],
            [supersub],
            [remarkIns],
          ]}
        >
          {post.content || "(No content)"}
        </Markdown>
      </div>
    </main>
  );
}
