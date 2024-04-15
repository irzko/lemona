import Image from "next/image";

const getImages = async () => {
  const res = await fetch("https://api.imgur.com/3/album/ZItRyC2/images", {
    headers: {
      Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
    },
  });
  const data = await res.json();
  return data.data;
};

export default async function Page() {
  // console.log(process);

  const images = await getImages();
  // console.log(images);
  return (
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
  );
}
