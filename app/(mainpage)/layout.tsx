import { Navbar } from "@/components/ui/navbar";
import { Bangers } from "next/font/google";
import Link from "next/link";
import React from "react";
import PostSidebar from "@/components/PostSidebar";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth"


const bangers = Bangers({
  weight: ["400"],
  subsets: ["latin"],
});

export default async function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  return (
    <>
      <Navbar>
        <SessionProvider basePath={"/auth"} session={session} refetchOnWindowFocus={false}>
          <PostSidebar/>
        </SessionProvider>

        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span
            className={`self-center text-2xl hover:no-underline text-gray-900 font-semibold whitespace-nowrap ${bangers.className}`}
          >
            Lemona
          </span>
        </Link>
        <Link
          href="/search"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-zinc-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </Link>
        <div className="relative hidden sm:block">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-zinc-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search-navbar"
            className="block w-full p-2 ps-10 text-sm text-zinc-500 border border-gray-300 rounded-lg bg-zinc-400/20 focus:ring-blue-500 focus:border-blue-500 placeholder:text-zinc-500"
            placeholder="Tìm kiếm truyện..."
          ></input>
        </div>
      </Navbar>
      {children}
    </>
  );
}
