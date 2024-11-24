"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { createPost } from "@/app/actions";
import LexicalEditor from "@/components/lexical";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { EditorState } from "lexical";
import Button from "@/components/ui/button";
import { useCallback } from "react";

export default function PostCreationForm({ authorId }: { authorId: string }) {
  const [content, setContent] = useState("");
  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const markdownText = $convertToMarkdownString(TRANSFORMERS);
      setContent(markdownText);
    });
  }, []);

  return (
    <form
      className="space-y-4 p-2"
      action={(formData) => {
        formData.append("content", content);
        formData.append("authorId", authorId);
        createPost(formData);
      }}
    >
      <div>
        <Input id="title" name="title" placeholder="Tiêu đề" required />
      </div>
      <LexicalEditor onChange={handleChange} />
      <Button type="submit">Đăng</Button>
    </form>
  );
}
