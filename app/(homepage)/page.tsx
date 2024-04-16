import { getDataSheet } from "@/lib/gSheet";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const data = await getDataSheet(
    "14AVcFaqm_2DgvbCVwZShOC5wHL6Ye2FORMt97KNZN2Y",
    "0"
  );

  const newFilms = data.reverse();
  // const newFilms = data.reverse().slice(0, 12);

  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-2">
        {/* <div className="flex justify-center mb-2">
          <div className="relative w-full max-w-sm">
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
            <Link
              href="/search"
              className="block w-full p-2 ps-10 text-sm text-left border rounded-lg bg-white border-gray-600 text-gray-400 focus:ring-blue-500 focus:border-blue-500"
            >
              Tìm kiếm
            </Link>
          </div>
        </div> */}
        <h4 className="text-xl mb-2 font-semibold">Truyện mới cập nhật</h4>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
          {newFilms.map((item) => (
            <li
              key={item.id}
              className="border border-gray-200 overflow-hidden bg-white rounded-lg"
            >
              <Link href={`/manga/${item.id}`}>
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={item.cover}
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
