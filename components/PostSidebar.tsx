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
          showSidebar(
            "Menu",
            () => {
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
                              xmlns="http://www.w3.org/2000/svg"
                              className="mt-0.5 absolute inset-0 m-auto"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                d="M17.806 14.837c.116.07.26.15.423.242.712.402 1.79 1.01 2.528 1.733.462.452.9 1.047.98 1.777.085.776-.253 1.504-.932 2.15-1.172 1.117-2.578 2.011-4.396 2.011H7.59c-1.819 0-3.224-.894-4.396-2.01-.679-.647-1.017-1.375-.933-2.151.08-.73.519-1.325.98-1.777.739-.723 1.816-1.33 2.529-1.733q.246-.137.423-.242a11.41 11.41 0 0 1 11.612 0M6.75 6.5a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0"
                              ></path>
                            </svg>
                          )}
                        </div>
                        <span>
                          {session.user.name || session.user.username}
                        </span>
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
            },
            true
          )
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
