"use client";

import Link from "next/link";

export default function Page() {
  return (
    <div>
      <ul>
        <li>
          <Link href="/dashboard/genre">Thể loại</Link>
        </li>
        <li>
          <Link href="/dashboard/book">Truyện</Link>
        </li>
        <li>
          <Link href="/dashboard/user">Tập</Link>
        </li>
      </ul>
    </div>
  );
}
