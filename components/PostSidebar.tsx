"use client";
import Button from "@/components/ui/Button";
import useSidebar from "@/hooks/useSidebar";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function PostSidebar() {
  const [sidebar, showSidebar] = useSidebar();
  const { data: session } = useSession();
  return (
    <>
      <Button
        onClick={() =>
          showSidebar("Menu", () => {
            return (
              <div>
                {session?.user ? (
                  <div>{session.user.username}</div>
                ) : (
                  <Link href="/login">Login</Link>
                )}
                <Link href="/create">Viết bài</Link>
              </div>
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
