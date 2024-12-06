"use client";
import { memo, useMemo, useState } from "react";
import Input from "@/components/ui/Input";
import { createPost } from "@/app/actions";
import { $convertToMarkdownString } from "@lexical/markdown";
import { PLAYGROUND_TRANSFORMERS } from "@/components/lexical/plugins/MarkdownTransformers";
import { EditorState } from "lexical";
import Button from "@/components/ui/Button";
import { useCallback } from "react";
import LexicalEditor from "@/components/lexical";
import buildCategoryTree, { CategoryTree } from "@/lib/buildCategoryTree";
import { Category } from "@prisma/client";

const CategorySelect = memo(function CategorySelect({
  categories,
}: {
  categories: Category[];
}) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>();

  const categoryTree = useMemo(
    () => buildCategoryTree(categories),
    [categories]
  );

  const handleCheckCategory = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const categoryId = e.target.value;
      const checked = e.target.checked;
      const category = categories.find(
        (category) => category.id === categoryId
      );
      if (!category) return;
      const parentCategoryId = category.parentCategoryId;
      if (parentCategoryId) {
        const parentElement = document.querySelector(
          `input[value="${parentCategoryId}"]`
        ) as HTMLInputElement;
        if (parentElement) {
          parentElement.checked = checked;
          handleCheckCategory({
            target: parentElement,
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
      const newSelectedCategories = new Set(selectedCategories);
      if (checked) {
        newSelectedCategories.add(categoryId);
      } else {
        newSelectedCategories.delete(categoryId);
      }
      setSelectedCategories(Array.from(newSelectedCategories));
    },
    [categories, selectedCategories]
  );

  const renderCategories = useCallback(
    (ctgTree?: CategoryTree[]) => {
      if (!ctgTree) return null;
      return ctgTree.map((category) => {
        return (
          <div key={category.id} className="pl-4">
            <div>
              <label>
                <input
                  type="checkbox"
                  onChange={handleCheckCategory}
                  value={category.id}
                />
                {category.name}
              </label>
            </div>
            {category.subcategories && renderCategories(category.subcategories)}
          </div>
        );
      });
    },
    [handleCheckCategory]
  );
  return (
    <div>{categoryTree.map((category) => renderCategories([category]))}</div>
  );
});

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
      <Input
        id="title"
        name="title"
        placeholder="Tiêu đề"
        autoComplete="false"
        required
      />

      <LexicalEditor onChange={handleChange} />

      <CategorySelect categories={categories} />
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
