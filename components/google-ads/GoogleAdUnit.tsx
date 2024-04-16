"use client";

import Script from "next/script";

export default function GoogleAdUnit() {
  return (
    <>
      <Script
        id="script-adsense"
        strategy="lazyOnload"
      >{`(adsbygoogle = window.adsbygoogle || []).push({});`}</Script>
    </>
  );
}
