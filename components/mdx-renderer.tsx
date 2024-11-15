"use client";
import { unified } from "unified";
import { Fragment, createElement, useEffect, useState } from "react";
import rehypeReact from "rehype-react";
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkGfm from 'remark-gfm'
import * as prod from "react/jsx-runtime";

const production = { Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs };

function useProcessor(text: string) {
  const [Content, setContent] = useState(createElement(Fragment));

  useEffect(
    function () {
      (async function () {
        const file = await unified()
          .use(remarkParse)
          .use(remarkRehype)
          .use(remarkGfm)
          .use(rehypeReact, production)
          .process(text);

        setContent(file.result);
      })();
    },
    [text],
  );

  return Content;
}

export default function MdxRenderer({ mdx }: { mdx: string }) {
  return useProcessor(mdx);
}
