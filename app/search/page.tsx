"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    if (keyword === "") {
      return;
    }
  };

  return (
    <main className="flex flex-col items-center">
      <div className="border-b h-16 flex justify-center items-center border-gray-200 w-full">
        <div className="flex justify-center items-center max-w-sm w-full p-2">
          <Button variant="light" isIconOnly className="mr-2" onPress={() => router.back()}>
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
          <div className="relative w-full">
            <Input
              onChange={handleChange}
              // variant="bordered"
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
          </div>
        </div>
      </div>
      <div className="max-w-sm w-full p-2">
        {/* <h2 className="font-semibold">Kết quả tìm kiếm</h2> */}
      </div>
    </main>
  );
}
