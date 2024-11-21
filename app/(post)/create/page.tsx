"use client";
import { Suspense } from "react";
import Editor from "@/components/editor";
import { type MDXEditorMethods } from "@mdxeditor/editor";
import { useRef, useState } from "react";
import Input from "@/components/ui/Input";
import { createPost } from "@/app/actions";
import { useSession } from "next-auth/react"

const markdown = `
Hello **world**!
`;
export default function Page() {
  const [title, setTitle] = useState("");
  const ref = useRef<MDXEditorMethods>(null);
  const { data: session } = useSession()
  if (!session?.user) return null


  
  return (
    <form className="space-y-4 p-2" action={(formData) => {
      formData.append("content", ref.current!.getMarkdown());
      formData.append("authorId", session.user!.id!);
      createPost(formData)
    }}>
      <div>
        <Input
          value={title}
          id="title"
          name= "title"
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
