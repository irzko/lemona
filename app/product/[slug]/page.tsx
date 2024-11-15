"use client"
import {products} from "@/lib/db"
import {unified} from 'unified'
import {Fragment,createElement, useEffect, useState} from 'react'
import rehypeReact from 'rehype-react'
import rehypeParse from 'rehype-parse'


const production = { Fragment};

function useProcessor(text : string) {
  const [Content, setContent] = useState(createElement(Fragment))

  useEffect(
    function () {
      ;(async function () {
        const file = await unified()
          .use(rehypeParse, {fragment: true})
          .use(rehypeReact, )
          .process(text)

        setContent(file.result)
      })()
    },
    [text]
  )

  return Content
}

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
      <p>{useProcessor(doc)}</p>
    </main>
  );
}