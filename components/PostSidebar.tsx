"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Drawer, DrawerContent, DrawerBody } from "@nextui-org/drawer";
import { Button } from "@nextui-org/button";
import { Listbox, ListboxSection, ListboxItem } from "@nextui-org/listbox";
import { useDisclosure } from "@nextui-org/modal";

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

export default function PostSidebar() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: session } = useSession();
  return (
    <>
      <Button onPress={onOpen} isIconOnly variant="bordered">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          role="img"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 5C3 4.44772 3.44772 4 4 4L20 4C20.5523 4 21 4.44772 21 5C21 5.55229 20.5523 6 20 6L4 6C3.44772 6 3 5.55228 3 5Z"
            fill="currentColor"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M3 12C3 11.4477 3.44772 11 4 11L20 11C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13L4 13C3.44772 13 3 12.5523 3 12Z"
            fill="currentColor"
          ></path>
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M3 19C3 18.4477 3.44772 18 4 18L20 18C20.5523 18 21 18.4477 21 19C21 19.5523 20.5523 20 20 20L4 20C3.44772 20 3 19.5523 3 19Z"
            fill="currentColor"
          ></path>
        </svg>
      </Button>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onOpenChange={onOpenChange}
        size="xs"
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
                        endContent={<Button>Đăng xuất</Button>}
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
                        <ListboxItem as={Link} key={item.id} href={item.href}>
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
