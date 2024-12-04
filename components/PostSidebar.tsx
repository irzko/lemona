"use client";
import Button from "@/components/ui/Button";
import useSidebar from "@/hooks/useSidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

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
  },
];

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
              <ul className="flex flex-col w-full px-2">
                {session?.user ? (
                  <li className="flex">
                    <Link
                      href={`/profile/${session?.user?.username}`}
                      className="flex w-full text-gray-500 hover:bg-gray-100 items-center p-2 gap-2 border border-gray-200 rounded-lg"
                    >
                      <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full">
                        {session.user.image ? (
                          <Image
                            fill
                            src={session.user.image}
                            alt={session.user.name || session.user.username}
                          ></Image>
                        ) : (
                          <svg
                            className="absolute w-12 h-12 text-gray-400 -left-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                              clipRule="evenodd"
                            ></path>
                          </svg>
                        )}
                      </div>
                      <span>{session.user.name || session.user.username}</span>
                    </Link>
                  </li>
                ) : (
                  <li>
                    <Link href="/auth/login">Login</Link>
                  </li>
                )}

                {sidebarItems.map((item) => {
                  return (
                    <li className="flex" key={item.id}>
                      <Link
                        className="w-full px-2 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                        href={item.href}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
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
