import { getDataSheet } from "@/lib/gSheet";
import Link from "next/link";
import Image from "next/image";
import GAds from "@/components/google-ads";

const getImages = async (albumHash: string) => {
  const res = await fetch(`https://api.imgur.com/3/album/${albumHash}/images`, {
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
  });
  const data = await res.json();
  return data.data;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const films = await getDataSheet(
    "14AVcFaqm_2DgvbCVwZShOC5wHL6Ye2FORMt97KNZN2Y",
    "1397060211"
  );

  const film = films.find((film) => film.id === params.slug);
  if (!film) {
    return <div>Not found</div>;
  }
  const images = await getImages(film.src);

  const eps = films.filter((f) => f.manga_id === film.manga_id);

  const info = await getDataSheet(
    "14AVcFaqm_2DgvbCVwZShOC5wHL6Ye2FORMt97KNZN2Y",
    "0"
  );

  const filmIndex = info.find((f) => f.id === film.manga_id);

  if (!filmIndex) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-screen-md space-y-2 w-full">
        <div>
          <h3 className="font-semibold text-3xl p-2">
            {filmIndex.title} - Chapter {film.chap}
          </h3>
        </div>
        <GAds />
    
        <div className="flex justify-center">
          <div>
            {images.map((image: any) => (
              <Image
                width={image.width}
                height={image.width}
                src={image.link}
                key={image.id}
                quality={100}
                alt=""
              />
            ))}
          </div>
        </div>

        <div>
          <ul className="flex gap-2 flex-wrap">
            {eps.map((f) => (
              <li key={f.id}>
                <Link
                  className={`flex p-2 h-10 w-10 justify-center items-center text-sm font-medium focus:outline-none rounded-lg focus:z-10 focus:ring-4 ${
                    f.id === params.slug
                      ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-800 text-white"
                      : "border bg-white text-gray-900 border-gray-600 hover:bg-white"
                  }`}
                  href={`/read/${f.id}`}
                >
                  <p>{f.chap}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
