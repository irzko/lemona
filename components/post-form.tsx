"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { createPost } from "@/app/actions";
import { $convertToMarkdownString } from "@lexical/markdown";
import { PLAYGROUND_TRANSFORMERS } from "@/components/lexical/plugins/MarkdownTransformers";
import { EditorState } from "lexical";
import Button from "@/components/ui/Button";
import { useCallback } from "react";
import LexicalEditor from "@/components/lexical";
import { Category } from "@prisma/client";
import Select from "./ui/select";
import { findChildCategories } from "@/lib/findChildCategories";

export default function PostForm({
  authorId,
  categories,
}: {
  authorId: string;
  categories: Category[];
}) {
  const [content, setContent] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

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
        formData.append("categoryIds", JSON.stringify(selectedCategories));
        createPost(formData);
      }}
    >
      <Input
        id="title"
        name="title"
        placeholder="Tiêu đề"
        autoComplete="false"
        required
      />

      <LexicalEditor onChange={handleChange} />

      <div className="space-y-4">
        <h2>Danh mục</h2>
        <Select
          onChange={(e) => {
            setSelectedCategories([...selectedCategories, e.target.value]);
          }}
        >
          <option value="">-- Chọn danh mục --</option>
          {findChildCategories(categories, null).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {selectedCategories.map((selectedCategory) => {
          const childCategories = findChildCategories(
            categories,
            selectedCategory
          );
          if (childCategories.length === 0) return null;
          return (
            <div key={selectedCategory}>
              <Select
                onChange={(e) => {
                  setSelectedCategories([
                    ...selectedCategories,
                    e.target.value,
                  ]);
                }}
              >
                <option>-- Chọn danh phụ --</option>
                {childCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
          );
        })}
      </div>
      <Input
        id="featuredImageURL"
        name="featuredImageURL"
        placeholder="Featured image URL"
        required
        autoComplete="false"
      />
      <Input
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        required
        autoComplete="false"
      />
      <Input
        id="tags"
        name="tags"
        placeholder="Thẻ bài viết"
        required
        autoComplete="false"
      />
      <Button className="w-full" color="light" type="submit">
        Đăng
      </Button>
    </form>
  );
}
