import { Bangers } from "next/font/google";
import Link from "next/link";
import React from "react";
import PostSidebar from "@/components/PostSidebar";
import { auth } from "@/auth";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import { Input } from "@nextui-org/input";

const bangers = Bangers({
  weight: ["400"],
  subsets: ["latin"],
});

export default async function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <>
      <Navbar
        shouldHideOnScroll
        isBordered
        className="bg-white"
        isBlurred={false}
      >
        <div className="h-full flex-row flex-nowrap items-center justify-center flex gap-4">
          <PostSidebar session={session} />
          <NavbarBrand>
            <Link
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <span
                className={`self-center text-2xl text-gray-900 font-semibold whitespace-nowrap ${bangers.className}`}
              >
                Lemona
              </span>
            </Link>
          </NavbarBrand>
        </div>
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
        <NavbarContent justify="end" className="hidden sm:flex">
          <NavbarItem>
            <Input
              startContent={
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
              }
              placeholder="Tìm kiếm"
            ></Input>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {children}
    </>
  );
}
