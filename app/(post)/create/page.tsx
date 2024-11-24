"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { createPost } from "@/app/actions";
import { useSession } from "next-auth/react";
import { ToolbarContext } from "@/components/lexical/context/ToolbarContext";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import Editor from "@/components/lexical/editor";
import { editorConfig } from "@/components/lexical/editorConfig";

import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";

export default function Page() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");

  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdownText = $convertToMarkdownString(TRANSFORMERS);
      setContent(markdownText);
    });
  };
  if (!session?.user) return null;

  return (
    <form
      className="space-y-4 p-2"
      action={(formData) => {
        formData.append("content", content);
        formData.append("authorId", session.user!.id!);
        createPost(formData);
      }}
    >
      <div>
        <Input id="title" name="title" placeholder="Tiêu đề" />
      </div>
      <LexicalComposer initialConfig={editorConfig}>
        <ToolbarContext>
          <Editor />
        </ToolbarContext>
        <OnChangePlugin onChange={onChange} />
      </LexicalComposer>
      <button type="submit">Submit</button>
    </form>
  );
}
