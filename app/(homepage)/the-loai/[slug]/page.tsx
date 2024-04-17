import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slugId = params.slug.split(".")[0].split("-").pop();

  const genre = await fetch(`${process.env.API_URL}/api/genres/${slugId}`, {
    next: { revalidate: 3600 }
  }).then((res) => res.json());

  return {
    title: genre.name,
  };
}

const getData = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/api/genres/${id}`, {
    next: { revalidate: 3600 }
  });
  const data = await res.json();
  return data;
};

export default async function Page({ params }: { params: { slug: string } }) {
  const slugId = params.slug.split(".")[0].split("-").pop();

  if (!slugId) {
    return <div>Not found</div>;
  }
  const data = await getData(slugId);
  if (!data) {
    return <div>Not found</div>;
  }

  return (
    <div className="flex justify-center">
      <div className="max-w-screen-lg w-full p-2">
        <h4 className="text-xl mb-2 font-semibold">Thể loại: {data.name}</h4>
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
          {data.mangas?.map((item: any) => (
            <li
              key={item.id}
              className="border border-gray-200 overflow-hidden bg-white rounded-lg"
            >
              <Link
                href={`/manga/${slugify(item.manga.title, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: false,
                  locale: "vi",
                  trim: true,
                })}-${item.mangaId}.html`}
              >
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={item.manga.imageCover || "/no-image.jpg"}
                    alt={item.manga.title}
                    fill
                    className="object-cover rounded-b-lg"
                  />
                </div>

                <h2 className="font-semibold p-2 flex justify-center text-center items-center min-h-16">
                  {item.manga.title}
                </h2>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
