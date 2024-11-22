import { auth } from "@/auth";
import Link from "next/link";

export default async function Menu() {
  const session = await auth();
  return (
    <main className="flex flex-col items-center">
      <div className="border-b h-16 flex justify-center items-center border-gray-200 w-full">
        <div className="flex items-center max-w-screen-lg w-full p-2">
          <button className="mr-2">
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
          </button>
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
    </main>
  );
}
