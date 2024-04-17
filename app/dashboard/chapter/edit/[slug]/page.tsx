"use client";
import { Input } from "@/components/ui/input";
import Select from "@/components/ui/select";
import React, { useEffect } from "react";
import { Fetcher } from "swr";
import useSWRImmutable from "swr/immutable";

const chapterFetcher: Fetcher<any, string> = async (url) => {
  return fetch(url).then((res) => res.json());
};
const mangaFetcher: Fetcher<any, string> = async (url) => {
  return fetch(url).then((res) => res.json());
};

export default function Page({ params }: { params: { slug: string } }) {
  // const { data: chapter } = useSWRImmutable(
  //   `/api/chapters/${params.slug}`,
  //   chapterFetcher
  // );

  const { data: manga } = useSWRImmutable("/api/manga", mangaFetcher);
  const [data, setData] = React.useState<{
    mangaId?: number;
    orderNumber?: number;
    title: string;
    chapterHash: string;
  }>({
    title: "",
    chapterHash: "",
  });

  useEffect(() => {
    fetch(`/api/chapters/${params.slug}`)
      .then((res) => res.json())
      .then((chapter) => {
        setData((prev) => ({
          ...prev,
          mangaId: chapter.mangaId,
          orderNumber: chapter.orderNumber,
          title: chapter.title,
          chapterHash: chapter.chapterHash,
        }));
      });
  }, [params.slug]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/chapters", {
      method: "PUT",
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
      </div>
    </div>
  );
}
