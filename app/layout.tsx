import type { Metadata } from "next";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import { Providers } from "./providers";

const roboto = Open_Sans({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lemona",
  description:
    "Một blog cá nhân với những bài viết về công nghệ, lập trình, và cuộc sống.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script
          id="Absence-banner"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4568231404553117"
          crossOrigin="anonymous"
        />
        <meta
          name="google-adsense-account"
          content="ca-pub-4568231404553117"
        ></meta>
      </head>
      <body className={`${roboto.className}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
