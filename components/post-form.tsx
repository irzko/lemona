"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { createPost } from "@/app/actions";
import { $convertToMarkdownString } from "@lexical/markdown";
import {PLAYGROUND_TRANSFORMERS} from "@/components/lexical/plugins/MarkdownTransformers";
import { EditorState } from "lexical";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/select";
import { useCallback } from "react";
import LexicalEditor from '@/components/lexical'

interface Category {
  id: string;
  name: string;
}

export default function PostForm({
  authorId,
  categories,
}: {
  authorId: string;
  categories: Category[];
}) {
  const [content, setContent] = useState("");
  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const markdownText = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
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
      <Select name="categoryId">
        {categories.map((category) => {
          return (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          );
        })}
      </Select>
      <Input id="featuredImageURL" name="featuredImageURL" placeholder="Featured image URL" required />
      <Input id="description" name="description" placeholder="Nhập mô tả" required />
      <Input id="tags" name="tags" placeholder="Thẻ bài viết" required />
      <Button className="w-full" color="light" type="submit">
        Đăng
      </Button>
    </form>
  );
}
