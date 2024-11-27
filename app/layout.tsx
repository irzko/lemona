import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ['latin'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Lemono",
  description:
    "Đọc truyện tranh online miễn phí tại Lẩu Truyện. Cập nhật truyện tranh mới nhất, nhanh nhất, hot nhất. Đọc truyện tranh chất lượng cao, cập nhật hàng ngày.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
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
      <body className={`${roboto.className}`}>{children}</body>
    </html>
  );
}
