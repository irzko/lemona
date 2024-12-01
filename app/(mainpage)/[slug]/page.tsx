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
    const { node, ...rest } = props;
    console.log(node?.tagName)
    return (
      <Image
        sizes="100vw"
        style={{ width: "100%", height: "auto" }}
        {...(rest as ImageProps)}
      />
    );
  },
  table(props) {
    const { children, node, ...rest } = props;
    console.log(node?.tagName)
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
    const { children, node, ...rest } = props;
    console.log(node?.tagName)
    return (
      <thead className="text-xs text-gray-700 uppercase bg-gray-50" {...rest}>
        {children}
      </thead>
    );
  },
  th(props) {
    const { children, node, ...rest } = props;
    console.log(node?.tagName)
    return (
      <th
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
        {...rest}
      >
        {children}
      </th>
    );
  },
  td(props) {
    const { children, node, ...rest } = props;
    console.log(node?.tagName)
    return (
      <td className="px-6 py-4" {...rest}>
        {children}
      </td>
    );
  },

  tr(props) {
    const { children, node, ...rest } = props;
    console.log(node?.tagName)
    return (
      <tr className="border-b" {...rest}>
        {children}
      </tr>
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
