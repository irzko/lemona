import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lẩu truyện - Đọc truyện tranh online miễn phí",
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
      <body className={`font-sans`}>{children}</body>
    </html>
  );
}
