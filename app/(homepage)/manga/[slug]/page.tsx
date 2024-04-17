import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";

const getData = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/api/manga/${id}`, {
    cache: "no-store",
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
  console.log(data.genres);

  const genres: string[] = data.genres.map(
    (g: { genre: { name: string } }) => g.genre.name
  );

  return (
    <div className="flex justify-center">
      <div className="p-2 max-w-screen-md w-full">
        <div className="flex mb-2 border border-gray-200 overflow-hidden bg-white rounded-lg">
          <div className="relative w-64 aspect-[3/4]">
            <Image
              src={data.imageCover || "/no-image.jpg"}
              alt={data.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="p-2 space-y-2 w-full">
            <h2 className="font-semibold text-2xl">{data.title}</h2>
            <hr className="border-gray-200 w-full" />
            <div className="text-sm">
              <h6 className="font-semibold">Thể loại:</h6>
              <p>{genres.join(" ⋅ ")}</p>
            </div>
            <hr className="border-gray-200" />
            <p className="text-sm">Năm: {data.publicationYear || "Chưa rõ"}</p>
          </div>
        </div>
        <div>
          <ul className="flex gap-2 flex-wrap">
            {data.chapters.map(
              (chapter: {
                id: number;
                orderNumber: number;
                chapterHash: string;
              }) => (
                <li key={chapter.id}>
                  <Link
                    className="flex p-2 h-10 w-10 justify-center text-gray-900 items-center text-sm font-medium focus:outline-none rounded-lg border focus:z-10 focus:ring-4 bg-white border-gray-300"
                    href={`/read/${slugify(data.title, {
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
