import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import remarkGfm from "remark-gfm";
import emoji from "remark-emoji";
import supersub from "remark-supersub";
import remarkIns from "remark-ins";
import Image from "next/image";
import Link from "next/link";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightLines from "rehype-highlight-code-lines";
import remarkFlexibleMarkers from "remark-flexible-markers";
import remarkFlexibleContainers from "remark-flexible-containers";
import "highlight.js/styles/dark.min.css";
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/breadcrumbs";
import {
  MDXComponents,
  MDXRemote,
  type MDXRemoteOptions,
} from "next-mdx-remote-client/rsc";
import { Suspense } from "react";
import slugify from "slugify";
import { Metadata } from "next";
import { Skeleton } from "@nextui-org/skeleton";

const getPost = unstable_cache(
  async (id: string) => {
    return await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
  },
  ["posts"],
  { tags: ["posts"] }
);

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
    },
  });
  return posts.map((post) => ({
    slug:
      slugify(post.title, {
        replacement: "-",
        remove: undefined,
        lower: true,
        strict: true,
        locale: "vi",
        trim: true,
      }) +
      "-" +
      post.id +
      ".html",
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const slug = (await params).slug;

  // fetch data
  const id = slug.split(".")[0].split("-").pop() || "";

  const post = await getPost(id);

  return {
    title: post ? post.title : "No title",
    // openGraph: {
    //   images: ["/some-specific-page-image.jpg", ...previousImages],
    // },
  };
}

const components: MDXComponents = {
  h1({ children }) {
    return <h1 className="text-4xl">{children}</h1>;
  },
  // h2({ children }) {
  //   return <h2 className="text-3xl font-medium">{children}</h2>;
  // },
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
  // p({ children }) {
  //   return <p className="text-gray-500">{children}</p>;
  // },
  blockquote({ children }) {
    return (
      <blockquote className="p-4 my-4 border-s-4 border-gray-300 bg-gray-50">
        {children}
      </blockquote>
    );
  },

  img({ alt, src }) {
    return (
      <Image
        width={0}
        height={0}
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
  hr() {
    return <hr className="h-px my-8 bg-gray-200 border-0" />;
  },
};

const LoadingComponent = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="w-3/5 rounded-lg">
        <div className="h-3 w-3/5 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton className="w-4/5 rounded-lg">
        <div className="h-3 w-4/5 rounded-lg bg-default-200" />
      </Skeleton>
      <Skeleton className="w-2/5 rounded-lg">
        <div className="h-3 w-2/5 rounded-lg bg-default-300" />
      </Skeleton>
    </div>
  );
};

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  const postId = slug.split(".")[0].split("-").pop();

  if (!postId) {
    return null;
  }
  const post = await getPost(postId);

  if (!post) {
    return (
      <main>
        <h2>404</h2>
      </main>
    );
  }

  const options: MDXRemoteOptions = {
    mdxOptions: {
      rehypePlugins: [
        [rehypeHighlight],
        [
          rehypeHighlightLines,
          {
            showLineNumbers: true,
          },
        ],
      ],
      remarkPlugins: [
        [remarkGfm, { singleTilde: false }],
        [emoji, { emoticon: true }],
        [supersub],
        [remarkIns],
        [remarkFlexibleMarkers],
        [remarkFlexibleContainers],
      ],
    },
    // parseFrontmatter: true,
  };

  // handle breadcrumbs from categories
  const breadcrumbs = post.categories.map((c) => ({
    id: c.category.id,
    name: c.category.name,
    href: `/category/${c.category.slug}`,
  }));
  return (
    <main className="flex justify-center">
      <div className="flex md:flex-row justify-center flex-col max-w-screen-lg w-full p-4 gap-4">
        <div className="w-full space-y-4">
          {/* <div className="flex gap-2">
            <Link
              href={breadcrumbs[0].href}
              className="text-blue-600 hover:underline"
            >
              {breadcrumbs[0].name}
            </Link>
            {breadcrumbs.slice(1).map((b) => (
              <span key={b.id} className="flex gap-2">
                <span>&gt;</span>
                <Link
                  key={b.id}
                  href={b.href}
                  className="text-blue-600 hover:underline"
                >
                  {b.name}
                </Link>
              </span>
            ))}
          </div> */}
          <Breadcrumbs>
            {breadcrumbs.map((item) => (
              <BreadcrumbItem as={Link} key={item.id} href={item.href}>
                {item.name}
              </BreadcrumbItem>
            ))}
          </Breadcrumbs>

          <h1 className="text-4xl font-medium">{post.title || "(No title)"}</h1>
          <p>
            {new Date(post.createdAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>

          <p className="font-semibold text-gray-900">{post.description}</p>
          <Suspense fallback={<LoadingComponent />}>
            <MDXRemote
              source={post.content}
              options={options}
              components={components}
            />
          </Suspense>
        </div>
        <div className="md:w-96 w-full h-96 border"></div>
      </div>
    </main>
  );
}
