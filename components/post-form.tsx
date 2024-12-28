"use client";
import { useState } from "react";
import { createPost } from "@/app/actions";
import { $convertToMarkdownString } from "@lexical/markdown";
import { PLAYGROUND_TRANSFORMERS } from "@/components/lexical/plugins/MarkdownTransformers";
import { EditorState } from "lexical";

import { useCallback } from "react";
import LexicalEditor from "@/components/lexical";
import { Category } from "@prisma/client";
import { findChildCategories } from "@/lib/findChildCategories";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";

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
    <div className="max-w-screen-lg w-full">
      <div className="">
        <form
          className="flex md:flex-row justify-center flex-col max-w-screen-lg w-full p-4 gap-4"
          action={(formData) => {
            formData.append("content", content);
            formData.append("authorId", authorId);
            formData.append("categoryIds", JSON.stringify(selectedCategoryIds));
            createPost(formData);
          }}
        >
          <div className="w-full space-y-4">
            <Input
              id="title"
              name="title"
              label="Tiêu đề"
              autoComplete="off"
              size="sm"
              isRequired
            />

            <LexicalEditor onChange={handleChange} />
          </div>
          <div className="md:w-96 w-full space-y-4">
            <div className="space-y-4">
              <Select
                label="Danh mục"
                size="sm"
                onChange={(e) => {
                  handleChangeCategories(e.target.value, 0);
                }}
              >
                {/* <option value="">-- Chọn danh mục --</option> */}
                {findChildCategories(categories, null).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
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
                      label="Danh mục phụ"
                      size="sm"
                      key={`child-${selectedCategoryIds[index]}`}
                      onChange={(e) => {
                        handleChangeCategories(e.target.value, index + 1);
                      }}
                    >
                      {/* <option>-- Chọn danh phụ --</option> */}
                      {childCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </Select>
                  );
                })}
            </div>
            <Input
              id="featuredImageURL"
              name="featuredImageURL"
              label="Featured image URL"
              isRequired
              autoComplete="off"
              size="sm"
            />
            <Input
              id="description"
              name="description"
              label="Nhập mô tả"
              isRequired
              size="sm"
              autoComplete="off"
            />
            <Input
              id="tags"
              name="tagNames"
              label="Thẻ bài viết"
              isRequired
              autoComplete="off"
              size="sm"
            />
            <Button className="w-full" variant="bordered">Đăng</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
