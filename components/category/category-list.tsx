"use client";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Category } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default function CategoryList({
  categories,
}: {
  categories: Category[];
}) {
  return (
    <Listbox
      aria-label="Danh mục"
      items={categories}
      classNames={{
        list: "max-h-[300px] overflow-y-scroll",
      }}
    >
      {(category) => {
        return (
          <ListboxItem
            as={Link}
            key={category.id}
            href={`/category/${category.slug}`}
          >
            {category.name}
          </ListboxItem>
        );
      }}
    </Listbox>
  );
}
