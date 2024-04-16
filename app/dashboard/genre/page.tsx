"use client";

import type { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function Page() {
  const [genres, setGenres] = React.useState<Genre[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setGenres(data.data));
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch("/api/genres", {
      method: "POST",
      body: JSON.stringify({
        name: e.currentTarget.genreName.value,
      }),
    }).then(() => {
      router.refresh();
    });
  };

  return (
    <div>
      <ul>
        {genres.map((genre) => (
          <li key={genre.id}>
            <span>{genre.name}</span>
            <button>Xóa</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input type="text" name="genreName" placeholder="Nhập tên thể loại" />
        <button type="submit">Thêm thể loại</button>
      </form>
    </div>
  );
}
