import {products} from "@/lib/db"
import MdxRenderer from "@/components/mdx-renderer"
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const doc = `
# Mercury

**Mercury** is the first planet from the [Sun](https://en.wikipedia.org/wiki/Sun)
and the smallest planet in the Solar System.
`
  
  const productId = (await params).slug.split(".")[0].split("-").pop();

  const product = products.findById(Number(productId));
  
  if (!product) {
    return (<main><h2>Không thấy sản phẩm</h2></main>)
  }
  return (
    <main>
      <h2>{product.name}</h2>
      <MdxRenderer mdx={doc}/>
    </main>
  );
}