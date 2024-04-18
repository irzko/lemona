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

  const manga = await fetch(`${process.env.API_URL}/api/manga/${slugId}`, {
    next: { revalidate: 3600 },
  }).then((res) => res.json());

  return {
    title: manga.title,
  };
}

const getData = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/api/manga/${id}/chapters`, {
    next: { revalidate: 3600 },
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

  return (
    <div className="flex justify-center">
      <div className="p-2 max-w-screen-md space-y-2 w-full">
        <div className="flex border border-gray-200 overflow-hidden bg-white rounded-lg">
          <div className="relative w-64 aspect-[3/4]">
            <Image
              src={data.imageCover || "/no-image.jpg"}
              alt={data.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="p-2 space-y-4 w-full">
            <h3 className="font-bold text-3xl">{data.title}</h3>
            {/* <hr className="border-gray-200 w-full" /> */}
            <div className="text-sm">
              <p className="font-semibold">Tác giả:</p>
              <p>{data.author || "Chưa rõ"}</p>
            </div>
            <div className="text-sm">
              <h6 className="font-semibold">Thể loại:</h6>
              <div className="flex gap-2">
                {data.genres.map(
                  (g: { genre: { id: string; name: string } }) => (
                    <Link
                      href={`/the-loai/${g.genre.id}`}
                      key={g.genre.id}
                      className="relative max-w-fit min-w-min inline-flex items-center justify-between box-border whitespace-nowrap px-1 h-7 text-small rounded-full bg-zinc-300"
                    >
                      <span className="flex-1 text-inherit font-normal px-2">
                        {g.genre.name}
                      </span>
                    </Link>
                  )
                )}
              </div>
              {/* <p>{genres.join(" ⋅ ")}</p> */}
            </div>
            {/* <hr className="border-gray-200" /> */}
            <div className="text-sm space-x-2">
              <span className="font-semibold">Năm:</span>
              <span>{data.publicationYear || "Chưa rõ"}</span>
            </div>
          </div>
        </div>
        <div className="text-sm flex mb-2 border border-gray-200 overflow-hidden bg-white rounded-lg flex-col p-2">
          <h5 className="text-xl font-bold">Giới thiệu:</h5>
          <p>{data.description || "Không có"}</p>
        </div>
        <div className="flex justify-center w-full">
          <ul className="grid grid-cols-10 sm:grid-cols-12 gap-2">
            {data.chapters.map(
              (chapter: {
                id: number;
                orderNumber: number;
                chapterHash: string;
              }) => (
                <li key={chapter.id}>
                  <Link
                    className="flex p-2 w-full aspect-square justify-center text-gray-900 items-center text-xs font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 bg-white border-gray-300"
                    href={`/doc-truyen/${slugify(data.title, {
                      replacement: "-",
                      remove: undefined,
                      lower: true,
                      strict: false,
                      locale: "vi",
                      trim: true,
                    })}-chapter-${chapter.orderNumber}-${chapter.id}.html`}
                  >
                    <p>{chapter.orderNumber}</p>
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
