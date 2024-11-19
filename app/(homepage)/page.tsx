import Link from "next/link";
import Image from "next/image";
import slugify from "slugify";

import { products } from "@/lib/db";

export default async function Home() {
  return (
    <main className="flex justify-center">
      <div className="max-w-screen-lg w-full p-2">
        <h4 className="text-xl mb-2 font-semibold">Sản phẩm mới cập nhật</h4>
        <ul className="grid grid-cols-2 list-none sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-2">
          {products.findMany().map((product) => (
            <li
              key={product.id}
              className="border border-gray-200 overflow-hidden bg-white rounded-lg"
            >
              <Link
                className="text-gray-800 hover:no-underline"
                href={`/product/${slugify(product.name, {
                  replacement: "-",
                  remove: undefined,
                  lower: true,
                  strict: false,
                  locale: "vi",
                  trim: true,
                })}-${product.id}.html`}
              >
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={product.image || "/no-image.jpg"}
                    alt={product.name}
                    fill
                    className="object-contain rounded-b-lg"
                  />
                </div>

                <h6 className="font-semibold p-2 flex justify-center text-center items-center min-h-16">
                  {product.name}
                </h6>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
