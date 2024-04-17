"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import Link from "next/link";
import React from "react";
import { Fetcher } from "swr";
import useSWRImmutable from "swr/immutable";

const mangaFetcher: Fetcher<any, string> = async (url) => {
  return fetch(url).then((res) => res.json());
};

const chapterFetcher: Fetcher<any, string> = async (url) => {
  return fetch(url).then((res) => res.json());
};

export default function Page() {
  const { data: manga } = useSWRImmutable("/api/manga", mangaFetcher);
  const { data: chapter } = useSWRImmutable("/api/chapters", mangaFetcher);

  const [data, setData] = React.useState<{
    mangaId?: number;
    orderNumber?: number;
    title: string;
    chapterHash: string;
  }>({
    title: "",
    chapterHash: "",
  });
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/chapters", {
      method: "POST",
      body: JSON.stringify(data),
    }).then(() => {
      setData({
        mangaId: undefined,
        orderNumber: undefined,
        title: "",
        chapterHash: "",
      });
      alert("Thêm tập thành công");
    });
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-screen-sm w-full">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <Select
              name="mangaId"
              value={data.mangaId}
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  mangaId: parseInt(e.target.value),
                }));
              }}
            >
              <option>Chọn truyện</option>
              {manga?.map((mg: any) => (
                <option key={mg.id} value={mg.id}>
                  {mg.title}
                </option>
              ))}
            </Select>
            <Input
              onChange={(e) => {
                setData((prev) => ({
                  ...prev,
                  orderNumber: parseInt(e.target.value),
                }));
              }}
              value={data.orderNumber}
              type="number"
              name="orderNumber"
              placeholder="Tập"
              required
            />
          </div>
          <Input
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                title: e.target.value,
              }));
            }}
            value={data.title}
            type="text"
            name="chapterName"
            placeholder="Tên tập (Tùy chọn)"
          />
          <Input
            onChange={(e) => {
              setData((prev) => ({
                ...prev,
                chapterHash: e.target.value,
              }));
            }}
            value={data.chapterHash}
            type="text"
            name="chapterHash"
            placeholder="Nguồn truyện"
            required
          />
          <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5">
            Thêm tập
          </button>
        </form>
        <div className="mt-4">
          <h2 className="text-lg font-medium">Danh sách tập mới nhất</h2>
          <ul>
            {chapter?.map((item: any) => (
              <li className="flex gap-2" key={item.id}>
                <span>{item.manga.title}</span>
                <span>-</span>
                <span>Chapter {item.orderNumber}</span>
                <Link href={`/dashboard/chapter/edit/${item.id}`}>
                  <span className="text-blue-700">Sửa</span>
                </Link>
                <button
                  onClick={() => {
                    fetch(`/api/chapters/${item.id}`, {
                      method: "DELETE",
                    }).then(() => {
                      alert("Xóa thành công");
                    });
                  }}
                  className="text-red-700"
                >
                  Xóa
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
