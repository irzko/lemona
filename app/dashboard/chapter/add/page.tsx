"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import { Genre } from "@prisma/client";
import React from "react";
import { Fetcher } from "swr";
import useSWRImmutable from "swr/immutable";

const mangaFetcher: Fetcher<any, string> = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  return data;
};

export default function Page() {
  const { data: manga } = useSWRImmutable("/api/manga", mangaFetcher);

  return (
    <>
      <form>
        <Select>
          {manga?.map((mg: any) => (
            <option key={mg.id} value={mg.id}>
              {mg.title}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Input type="number" name="chapterName" placeholder="Tập" />
          <Input
            type="text"
            name="chapterName"
            placeholder="Tên tập (Tùy chọn)"
          />
        </div>
      </form>
    </>
  );
}
