"use client";
import Link from "next/link";
import Image from "next/image";
import { Drawer, DrawerContent, DrawerBody } from "@nextui-org/drawer";
import { Button } from "@nextui-org/button";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { useDisclosure } from "@nextui-org/modal";
import { Session } from "next-auth";

const sidebarItems = [
  {
    id: 1,
    name: "Viết bài",
    href: "/create",
  },
  {
    id: 2,
    name: "Danh mục",
    href: "/category",
  },
];

export default function PostSidebar({ session }: { session: Session | null }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  return (
    <>
      <Button onPress={onOpen} isIconOnly variant="light">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={24}
          height={24}
          fill={"none"}
        >
          <path
            d="M4 8.5L20 8.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 15.5L20 15.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="xs"
        onClose={onClose}
      >
        <DrawerContent>
          {() => (
            <>
              <DrawerBody>
                <Listbox className="flex flex-col w-full space-y-2">
                  <>
                    {session?.user ? (
                      <ListboxItem
                        as={Link}
                        startContent={
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
                        }
                        className="flex items-center p-2 gap-2"
                        href={`/profile/${session?.user?.username}`}
                      >
                        <span>
                          {session.user.name || session.user.username}
                        </span>
                      </ListboxItem>
                    ) : (
                      <ListboxItem href="/auth/login">Login</ListboxItem>
                    )}

                    {sidebarItems.map((item) => {
                      return (
                        <ListboxItem
                          as={Link}
                          className="py-2"
                          key={item.id}
                          href={item.href}
                        >
                          {item.name}
                        </ListboxItem>
                      );
                    })}
                  </>
                </Listbox>
              </DrawerBody>
            </>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
