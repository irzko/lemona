import Image from "next/image";
import AdSense from "@/components/google-ads/AdSense";
import { Navbar, NavbarContent } from "@/components/ui/navbar";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import slugify from "slugify";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slugId = params.slug.split(".")[0].split("-").pop();

  const chapter = await fetch(`${process.env.API_URL}/api/chapters/${slugId}`, {
    next: { revalidate: 3600 },
  }).then((res) => res.json());

  return {
    title: chapter.manga.title + " - Chapter " + chapter.orderNumber,
  };
}

const getImages = async (albumHash: string) => {
  const res = await fetch(`https://api.imgur.com/3/album/${albumHash}/images`, {
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
  });
  const data = await res.json();
  return data.data;
};

const getData = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/api/chapters/${id}`, {
    next: { revalidate: 3600 },
  });
  const data = await res.json();
  return data;
};

const getManga = async (id: string) => {
  const res = await fetch(`${process.env.API_URL}/api/manga/${id}`, {
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

  const manga = await getManga(data.mangaId);

  const images = await getImages(data.chapterHash);

  return (
    <>
      <Navbar>
        <Link
          href={`/manga/${slugify(data.manga.title, {
            replacement: "-",
            remove: undefined,
            lower: true,
            strict: false,
            locale: "vi",
            trim: true,
          })}-${manga.id}.html`}
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          <span className="sr-only">Back to manga</span>
          <svg
            className="w-6 h-6 text-gray-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
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
        <div className="space-x-2">
          {data.previousChapter && (
            <Link
              href={`/doc-truyen/${slugify(data.manga.title, {
                replacement: "-",
                remove: undefined,
                lower: true,
                strict: false,
                locale: "vi",
                trim: true,
              })}-chapter-${data.previousChapter.orderNumber}-${
                data.previousChapter.id
              }.html`}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Previous Chapter</span>
              <svg
                className="w-6 h-6 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m15 19-7-7 7-7"
                />
              </svg>
            </Link>
          )}
          {data.nextChapter && (
            <Link
              href={`/doc-truyen/${slugify(data.manga.title, {
                replacement: "-",
                remove: undefined,
                lower: true,
                strict: false,
                locale: "vi",
                trim: true,
              })}-chapter-${data.nextChapter.orderNumber}-${
                data.nextChapter.id
              }.html`}
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <span className="sr-only">Next Chapter</span>
              <svg
                className="w-6 h-6 text-gray-800"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m9 5 7 7-7 7"
                />
              </svg>
            </Link>
          )}
        </div>
      </Navbar>
      <main>
        <div className="flex justify-center">
          <div className="max-w-screen-md space-y-2 w-full">
            <div>
              <h5 className="font-semibold text-xl p-2">
                {data.manga.title} - Chapter {data.orderNumber}
              </h5>
            </div>
            <AdSense />

            <div className="flex justify-center">
              <div>
                {images.map((image: any, index: number) => (
                  <Image
                    width={image.width}
                    priority={index < 1}
                    height={image.height}
                    src={image.link}
                    key={image.id}
                    quality={100}
                    alt=""
                  />
                ))}
              </div>
            </div>

            {/* <div>
          <ul className="flex gap-2 flex-wrap">
            {eps.map((f) => (
              <li key={f.id}>
                <Link
                  className={`flex p-2 h-10 w-10 justify-center items-center text-sm font-medium focus:outline-none rounded-lg focus:z-10 focus:ring-4 ${
                    f.id === slugId
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
        </div> */}
          </div>
        </div>
      </main>
    </>
  );
}
