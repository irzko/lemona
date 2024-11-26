"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { createPost } from "@/app/actions";
import LexicalEditor from "@/components/lexical";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { EditorState } from "lexical";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/select";
import { useCallback } from "react";
import {Post} from "@prisma/client"



interface Category {
  id: string;
  name: string;
}

export default function EditPostForm({
  authorId,
  categories,
  post
}: {
  authorId: string;
  categories: Category[];
post: Post
}) {
  const [content, setContent] = useState("");
  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const markdownText = $convertToMarkdownString(TRANSFORMERS);
      setContent(markdownText);
    });
  }, []);

  return (
    <form
      className="gap-6 p-4 flex flex-col"
      action={(formData) => {
        formData.append("content", content);
        formData.append("authorId", authorId);
        createPost(formData);
      }}
    >
      <Input id="title" name="title" placeholder="Tiêu đề" required />

      <LexicalEditor onChange={handleChange} />
      <Select value={post.categoryId} name="categoryId">
        {categories.map((category) => {
          return (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          );
        })}
      </Select>
      <Input id="featuredImageURL" name="featuredImageURL" placeholder="Featured image URL" required />
      <Input id="tag" name="tag" placeholder="Thẻ bài viết" required />
      <Button className="w-full" color="light" type="submit">
        Đăng
      </Button>
    </form>
  );
}
