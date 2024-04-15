"use client";

import { useEffect, useState } from "react";

export default function VideoWithBlob({ src }: { src: string }) {
  const [videoUrl, setVideoUrl] = useState("");
  console.log(src);

  useEffect(() => {
    const fetchBlob = async () => {
      const blobResponse = await fetch(src);
      const blob = await blobResponse.blob();
      const temporaryUrl = URL.createObjectURL(blob);
      setVideoUrl(temporaryUrl);
    };

    fetchBlob();

    // Clean up the temporary URL when the component unmounts
    return () => URL.revokeObjectURL(videoUrl);
  }, [src, videoUrl]);
  return (
    <video
      className="max-w-screen-lg w-full"
      crossOrigin="anonymous"
      controls
      preload="auto"
      autoPlay
    >
      <source src={videoUrl} />
      Your browser does not support the video tag.
    </video>
  );
}
