"use client"
import { Suspense } from "react";
import Editor from "@/components/editor"
import {type MDXEditorMethods} from "@mdxeditor/editor"
import {useRef} from "react"



const markdown = `
Hello **world**!
`
export default function Page() {
  const ref = useRef<MDXEditorMethods>(null)
  console.log(ref.current)
  return (
    <div style={{ border: "1px solid black" }}>
      <Suspense fallback={<div>Đang tải editor...</div>}>
        <Editor markdown={markdown} />
      </Suspense>
    </div>
  );
}
