"use client";

import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Navbar, NavbarContent } from "@nextui-org/navbar";
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
      <Navbar isBordered>
        <NavbarContent className="w-full justify-between">
          <Button
            variant="light"
            isIconOnly
      
            onPress={() => router.back()}
          >
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
        </NavbarContent>
      </Navbar>
      <div className="max-w-sm w-full p-2">
        {/* <h2 className="font-semibold">Kết quả tìm kiếm</h2> */}
      </div>
    </main>
  );
}
