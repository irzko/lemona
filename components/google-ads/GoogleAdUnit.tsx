"use client";

import Script from "next/script";

export default function GoogleAdUnit() {
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
      <Script
        id="adsbygoogle"
        strategy="lazyOnload"
      >{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
    </>
  );
}
