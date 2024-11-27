"use client"
import { useSession } from "next-auth/react"
import Button from "@/components/ui/Button";
import { useState } from "react";
import Link from "next/link";

export default function Menu() {
  const [isToggle, setIsToggle] = useState<boolean>(false);
  return (
    <>
    <Button onClick={() => setIsToggle(!isToggle)} isIconOnly color="light">
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
    {isToggle && <MenuPage onClose={() => setIsToggle(!isToggle)} />}
      </>
  );
}



function MenuPage({onClose}: {onClose: () => void}) {
  const { data: session } = useSession()
  return (
    <main className="flex flex-col items-center">
      <div className="border-b h-16 flex justify-center items-center border-gray-200 w-full">
        <div className="flex items-center max-w-screen-lg w-full p-2">
          <Button isIconOnly color="light" onClick={onClose}>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 12h14M5 12l4-4m-4 4 4 4"
              />
            </svg>
          </Button>
          <h6 className="font-semibold">Menu</h6>
        </div>
      </div>
      <div className="max-w-sm w-full p-2">
        {session?.user ? (
          <div>{session.user.username}</div>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </div>
      <Link href="/create">Viết bài</Link>
    </main>
  );
}
