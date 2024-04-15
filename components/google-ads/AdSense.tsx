"use client";

import dynamic from "next/dynamic";
const GoogleAdUnit = dynamic(() => import("./GoogleAdUnit"), { ssr: false });

export default function AdSense() {
  return (
    <>
      <GoogleAdUnit />
    </>
  );
}
