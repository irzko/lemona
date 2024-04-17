"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
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
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/chapters", {
      method: "POST",
      body: JSON.stringify({
        mangaId: parseInt(e.currentTarget.mangaId.value),
        orderNumber: parseInt(e.currentTarget.orderNumber.value),
        title: e.currentTarget.chapterName.value,
        chapterHash: e.currentTarget.chapterHash.value,
      }),
    });
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-screen-sm w-full">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <Select name="mangaId">
              {manga?.map((mg: any) => (
                <option key={mg.id} value={mg.id}>
                  {mg.title}
                </option>
              ))}
            </Select>
            <Input type="number" name="orderNumber" placeholder="Tập" />
          </div>
          <Input
            type="text"
            name="chapterName"
            placeholder="Tên tập (Tùy chọn)"
          />
          <Input type="text" name="chapterHash" placeholder="Nguồn truyện" />
          <button>Thêm tập</button>
        </form>
      </div>
    </div>
  );
}
