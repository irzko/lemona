"use client";
import Button from "@/components/ui/Button";
import useSidebar from "@/hooks/useSidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";


const sidebarItems = [
  {
    id: 1,
    name: "Viết bài",
    href: "/create",
  },
  {
    id: 2,
    name: "Danh mục",
    href: "/categories",
  }
]

export default function PostSidebar() {
  const [sidebar, showSidebar] = useSidebar();
  const { data: session } = useSession();
  return (
    <>
      <Button
        isIconOnly
        className="hover:bg-gray-100 text-gray-500"
        onClick={() =>
          showSidebar("Menu", () => {
            return (
              <ul className="flex flex-col w-full list-none px-4">
                {session?.user ? (
                  <li>{session.user.name || session.user.username}</li>
                ) : (
                  <li>
                    <Link href="/auth/login">Login</Link>
                  </li>
                )}
                {sidebarItems.map((item)=> {
                return (
                  <li className="flex" key={item.id}>
                    <Link className="w-full px-4 py-2 hover:no-underline text-gray-500 hover:bg-gray-100 rounded-lg" href={item.href}>{item.name}</Link>
                  </li>
                )
                })}
              </ul>
            );
          })
        }
      >
        <svg
          className="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </Button>
      {sidebar}
    </>
  );
}
