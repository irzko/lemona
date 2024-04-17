import Image from "next/image";
import AdSense from "@/components/google-ads/AdSense";

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

  const images = await getImages(data.chapterHash);

  return (
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
  );
}
