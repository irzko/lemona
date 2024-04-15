"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR, { Fetcher } from "swr";
import Image from "next/image";

const filmFetcher: Fetcher<Film[], string> = async (key) => {
  return fetch(key).then((res) => res.json());
};

export default function SearchPage() {
  // const [keyword, setKeyword] = useState("");
  const [films, setFilms] = useState<Film[]>([]);
  const { data } = useSWR("/api/mangas", filmFetcher);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = event.target.value;
    if (keyword === "") {
      setFilms([]);
      return;
    }
    const filteredFilms = data?.filter((film) =>
      film.title.toLowerCase().includes(keyword.toLowerCase())
    );
    setFilms(filteredFilms || []);
  };
  return (
    <main className="flex flex-col items-center">
      <div className="border-b h-16 flex justify-center items-center border-gray-200 w-full">
        <div className="flex justify-center items-center max-w-sm w-full p-2">
          <Link className="mr-2" href="/">
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
          </Link>
          <div className="relative w-full">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
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
            </div>
            <input
              type="text"
              className="block w-full p-2 ps-10 text-sm border rounded-lg bg-white border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tìm kiếm"
              // value={keyword}
              onChange={handleChange}
              autoFocus
            ></input>
          </div>
        </div>
      </div>
      <div className="max-w-sm w-full p-2">
        {/* <h2 className="font-semibold">Kết quả tìm kiếm</h2> */}
        <ul>
          {films.map((film) => (
            <li
              key={film.id}
              className="border mb-2 border-gray-200 overflow-hidden bg-white rounded-lg"
            >
              <Link className="flex items-center" href={`watch/${film.id}`}>
                <div className="relative w-16 aspect-[3/4]">
                  <Image
                    src={film.thumbnail}
                    alt={film.title}
                    fill
                    className="object-cover rounded-b-lg"
                  />
                </div>
                <h2 className="font-semibold p-2">{film.title}</h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
