"use client";

import dynamic from "next/dynamic";
const Ads = dynamic(() => import("./ads"), { ssr: false });

export default function GAds() {
  return (
    <>
      <Ads />
    </>
  );
}
