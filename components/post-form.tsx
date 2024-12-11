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
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const handleChangeCategories = useCallback(
    (categoryId: string, index: number) => {
      if (categoryId === "") {
        setSelectedCategoryIds(selectedCategoryIds.slice(0, index));
        return;
      }
      if (index === selectedCategoryIds.length) {
        setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
        return;
      } else if (index < selectedCategoryIds.length - 1) {
        const newSelectedCategoryIds = selectedCategoryIds.slice(0, index + 1);
        setSelectedCategoryIds(
          newSelectedCategoryIds.map((id, i) => {
            if (i === index) {
              return categoryId;
            }
            return id;
          })
        );
      }
    },
    [selectedCategoryIds]
  );

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
        formData.append("categoryIds", JSON.stringify(selectedCategoryIds));
        createPost(formData);
      }}
    >
      <Input
        id="title"
        name="title"
        placeholder="Tiêu đề"
        autoComplete="off"
        required
      />

      <LexicalEditor onChange={handleChange} />

      <div className="space-y-4">
        <h2>Danh mục</h2>
        <Select
          onChange={(e) => {
            handleChangeCategories(e.target.value, 0);
          }}
        >
          <option value="">-- Chọn danh mục --</option>
          {findChildCategories(categories, null).map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
        {selectedCategoryIds.length > 0 &&
          selectedCategoryIds.map((selectedCategory, index) => {
            const childCategories = findChildCategories(
              categories,
              selectedCategory
            );
            if (childCategories.length === 0) return null;
            return (
              <Select
                key={`child-${selectedCategoryIds[index]}`}
                onChange={(e) => {
                  handleChangeCategories(e.target.value, index + 1);
                }}
              >
                <option>-- Chọn danh phụ --</option>
                {childCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            );
          })}
      </div>
      <Input
        id="featuredImageURL"
        name="featuredImageURL"
        placeholder="Featured image URL"
        required
        autoComplete="off"
      />
      <Input
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        required
        autoComplete="off"
      />
      <Input
        id="tags"
        name="tagNames"
        placeholder="Thẻ bài viết"
        required
        autoComplete="off"
      />
      <Button className="w-full" color="light" type="submit">
        Đăng
      </Button>
    </form>
  );
}
