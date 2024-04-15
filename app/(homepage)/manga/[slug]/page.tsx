import { getDataSheet } from "@/lib/gSheet";
import Link from "next/link";
import Image from "next/image";

export default async function Page({ params }: { params: { slug: string } }) {
  const allFilms = await getDataSheet(
    "14AVcFaqm_2DgvbCVwZShOC5wHL6Ye2FORMt97KNZN2Y",
    "1397060211"
  );

  const filmIndex = await getDataSheet(
    "14AVcFaqm_2DgvbCVwZShOC5wHL6Ye2FORMt97KNZN2Y",
    "0"
  );

  const info = filmIndex.find((film) => film.id === params.slug);

  if (!info) {
    return <div>Not found</div>;
  }

  const films = allFilms.filter((manga) => manga.manga_id === params.slug);

  if (!films) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="p-2 max-w-screen-sm w-full">
        <div className="flex mb-2 border border-gray-200 overflow-hidden bg-white rounded-lg">
          <div className="relative w-64 aspect-[3/4]">
            <Image
              src={info.cover}
              alt={info.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="p-2 space-y-2 w-full">
            <h2 className="font-semibold text-2xl">{info.title}</h2>
            {/* <hr className="border-gray-200 w-full" />
            <p className="text-sm">
              Thể loại:
              <br />
              {info.genre.replace(/;/g, ", ")}
            </p>
            <hr className="border-gray-200" />
            <p className="text-sm">Năm: {info.year}</p> */}
          </div>
        </div>
        <div>
          <ul className="flex gap-2 flex-wrap">
            {films.map((film) => (
              <li key={film.id}>
                <Link
                  className="flex p-2 h-10 w-10 justify-center text-gray-900 items-center text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 bg-white border-gray-300"
                  href={`/read/${film.id}`}
                >
                  <p>{film.chap}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
