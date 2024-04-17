import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";
import { Manga } from "@prisma/client";

const getData = async (): Promise<Manga[]> => {
  const res = await fetch(`${process.env.API_URL}/api/manga`, {
    // cache: "no-store",
  });
  const data = await res.json();
  return data;
};

export default async function Home() {
  const manga = await getData();

  // const newFilms = data.reverse();
  // const newFilms = data.reverse().slice(0, 12);

  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-2">
        <h4 className="text-xl mb-2 font-semibold">Truyện mới cập nhật</h4>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
          {manga.map((item) => (
            <li
              key={item.id}
              className="border border-gray-200 overflow-hidden bg-white rounded-lg"
            >
              <Link
                href={`/manga/${slugify(item.title, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: false,
                  locale: "vi",
                  trim: true,
                })}-${item.id}.html`}
              >
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={item.imageCover || "/no-image.jpg"}
                    alt={item.title}
                    fill
                    className="object-cover rounded-b-lg"
                  />
                </div>

                <h2 className="font-semibold p-2 flex justify-center text-center items-center min-h-16">
                  {item.title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
