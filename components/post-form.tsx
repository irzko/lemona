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
import { Card, CardBody } from "@nextui-org/card";

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
                <Select
                  label="Danh mục"
                  labelPlacement="outside"
                  placeholder="Chọn danh mục"
                  onChange={(e) => {
                    handleChangeCategories(e.target.value, 0);
                  }}
                >
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
                        placeholder="Chọn danh mục phụ"
                        key={`child-${selectedCategoryIds[index]}`}
                        onChange={(e) => {
                          handleChangeCategories(e.target.value, index + 1);
                        }}
                      >
                        {childCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </Select>
                    );
                  })}
              </CardBody>
            </Card>
            <Card shadow="sm">
              <CardBody className="flex flex-col gap-4">
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

            <Button className="w-full" variant="bordered">
              Đăng
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
