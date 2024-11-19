"use client";
import { Suspense } from "react";
import Editor from "@/components/editor";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import { useRef, useState } from "react";
import Input from "@/components/ui/Input";
import { createPost } from "@/app/actions";

const markdown = `
Hello **world**!
`;
export default function Page() {
  const [title, setTitle] = useState("");

  const ref = useRef<MDXEditorMethods>(null);

  
  return (
    <form className="space-y-4 p-2" action={(formData) => {
      formData.append("title", title);
      createPost(formData)
    }}>
      <div>
        <Input
          value={title}
          id="title"
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề"
        />
      </div>
      <Suspense fallback={<div>Đang tải editor...</div>}>
        <div className="border border-gray-300 rounded-lg">
          <Editor ref={ref} markdown={markdown} />
        </div>
      </Suspense>
      <button type="submit">Submit</button>
    </form>
  );
}
