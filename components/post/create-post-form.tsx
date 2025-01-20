"use client";
import { useState } from "react";
import { createPost } from "@/app/actions";
import { $convertToMarkdownString } from "@lexical/markdown";
import { PLAYGROUND_TRANSFORMERS } from "@/components/lexical/plugins/MarkdownTransformers";
import { EditorState } from "lexical";

import { useCallback } from "react";
import LexicalEditor from "@/components/lexical";
import { Category } from "@prisma/client";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import SelectCategoryModal from "./select-category-modal";

export default function CreatePostForm({
  authorId,
  categories,
}: {
  authorId: string;
  categories: Category[];
}) {
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategoryIds] = useState<string[]>([]);

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
            formData.append("categoryIds", JSON.stringify(selectedCategory));
            createPost(formData);
          }}
        >
          <div className="w-full space-y-4">
            <Input
              id="title"
              name="title"
              labelPlacement="outside"
              label="Tiêu đề"
              placeholder="Nhập tiêu đề"
              autoComplete="off"
              isRequired
            />
            <div>
              <p className="mb-2 text-sm">Nội dung</p>
              <LexicalEditor onChange={handleChange} />
            </div>
          </div>
          <div className="md:w-96 w-full space-y-4">
            <Card shadow="sm">
              <CardBody className="flex flex-col gap-4">
                <div>
                  <p className="text-sm mb-2">Danh mục</p>
                  <SelectCategoryModal
                    categories={categories}
                    selectedCategoryIds={selectedCategory}
                    setSelectedCategoryIds={setSelectedCategoryIds}
                  />
                </div>
                <Input
                  id="featuredImageURL"
                  name="featuredImageURL"
                  labelPlacement="outside"
                  label="Hình ảnh tiêu biểu"
                  placeholder="Nhập URL hình ảnh tiêu biểu"
                  isRequired
                  autoComplete="off"
                />
                <Input
                  id="description"
                  name="description"
                  labelPlacement="outside"
                  label="Mô tả"
                  placeholder="Nhập mô tả"
                  isRequired
                  autoComplete="off"
                />
                <Input
                  id="tags"
                  name="tagNames"
                  label="Thẻ bài viết"
                  labelPlacement="outside"
                  placeholder="Nhập thẻ bài viết"
                  isRequired
                  autoComplete="off"
                />
              </CardBody>
            </Card>

            <Button className="w-full" variant="solid" color="primary">
              Đăng
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
