"use client";

import dynamic from "next/dynamic";
const GoogleAdUnit = dynamic(() => import("./GoogleAdUnit"), { ssr: false });

export default function AdSense() {
  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4568231404553117"
        data-ad-slot="2442258448"
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
      <GoogleAdUnit />
    </>
  );
}
