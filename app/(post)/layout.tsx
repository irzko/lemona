import { Silkscreen } from "next/font/google";
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
import { Button } from "@nextui-org/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Input } from "@nextui-org/input";

const silkscreen = Silkscreen({
  weight: ["400"],
  subsets: ["latin"],
});

export default async function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <>
      <Navbar shouldHideOnScroll isBordered>
        <NavbarBrand>
          <Link
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <span
              className={`self-center text-2xl font-semibold whitespace-nowrap ${silkscreen.className}`}
            >
              Lemona
            </span>
          </Link>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavbarItem className="hidden md:flex">
            <Input
              startContent={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={24}
                  height={24}
                  fill={"none"}
                >
                  <path
                    d="M17.5 17.5L22 22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              placeholder="Tìm kiếm"
            ></Input>
          </NavbarItem>
          <NavbarItem>
            <Button
              as={Link}
              isIconOnly
              variant="light"
              href="/search"
              className="md:hidden"
              aria-label="Tìm kiếm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width={24}
                height={24}
                fill={"none"}
              >
                <path
                  d="M17.5 17.5L22 22"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
            </Button>
          </NavbarItem>
          <NavbarItem>
            <ThemeSwitcher />
          </NavbarItem>
          <NavbarItem>
            <PostSidebar session={session} />
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      {children}
    </>
  );
}
