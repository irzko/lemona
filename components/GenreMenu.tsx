"use client";
import { Genre } from "@prisma/client";
import DropDown, { DropDownItem } from "./DropDown";
import { usePathname, useRouter } from "next/navigation";

export default function GenreMenu({ genres }: { genres: Genre[] }) {
  const router = useRouter();
  const slug = usePathname().split("/").pop() || "";

  return (
    <DropDown
      buttonClassName="flex gap-2 items-center"
      buttonLabel={`${
        genres?.find((genre) => genre.id.toString() === slug)?.name ||
        "Thể loại"
      }`}
    >
      {genres?.map((genre) => (
        <DropDownItem
          key={genre.id}
          className={`block text-left ${
            slug === genre.id.toString()
              ? "text-blue-500 font-semibold"
              : "hover:text-gray-900 text-gray-500"
          }`}
          onClick={() => router.push(`/the-loai/${genre.id}`)}
        >
          {genre.name}
        </DropDownItem>
      ))}
    </DropDown>
  );
}
