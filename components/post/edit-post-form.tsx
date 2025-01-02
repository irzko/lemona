"use client";
import { useState } from "react";

import { updatePost } from "@/app/actions";
import { $convertToMarkdownString } from "@lexical/markdown";
import { EditorState } from "lexical";
import { PLAYGROUND_TRANSFORMERS } from "@/components/lexical/plugins/MarkdownTransformers";
import { useCallback } from "react";
import {
  Post,
  TagsOnPosts,
  Tag,
  CategoriesOnPosts,
  Category,
} from "@prisma/client";
import LexicalEditor from "@/components/lexical";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import SelectCategoryModal from "./select-category-modal";

function sortCategories(categories: Category[]) {
  const result: string[] = [];
  function addChildren(parentId: string | null) {
    categories
      .filter((category) => category.parentCategoryId === parentId)
      .forEach((category) => {
        result.push(category.id);
        addChildren(category.id);
      });
  }
  addChildren(null);
  return result;
}

export default function EditPostForm({
  categories,
  post,
}: {
  authorId: string;
  categories: Category[];
  post: Post & {
    tags: TagsOnPosts & { tag: Tag }[];
    categories: CategoriesOnPosts & { category: Category }[];
  };
}) {
  const [content, setContent] = useState(post.content);

  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
    sortCategories(
      post.categories.map((selectedCategory) => selectedCategory.category)
    )
  );

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const markdownText = $convertToMarkdownString(PLAYGROUND_TRANSFORMERS);
      setContent(markdownText);
    });
  }, []);

  return (
    <form
      className="gap-6 flex flex-col"
      action={(formData) => {
        formData.append("content", content);
        formData.append("id", post.id);
        formData.append("categoryIds", JSON.stringify(selectedCategoryIds));
        updatePost(formData);
      }}
    >
      <Input
        id="title"
        name="title"
        placeholder="Tiêu đề"
        defaultValue={post.title}
        required
        autoComplete="false"
      />

      <LexicalEditor onChange={handleChange} markdown={post.content} />
      <div className="space-y-4">
        <h2>Danh mục</h2>
        <SelectCategoryModal
          categories={categories}
          selectedCategoryIds={selectedCategoryIds}
          setSelectedCategoryIds={setSelectedCategoryIds}
        />
      </div>
      <Input
        autoComplete="false"
        id="featuredImageURL"
        name="featuredImageURL"
        placeholder="Featured image URL"
        defaultValue={post.featuredImageURL}
        required
      />
      <Input
        autoComplete="false"
        id="description"
        name="description"
        placeholder="Nhập mô tả"
        defaultValue={post.description}
        required
      />
      <Input
        autoComplete="false"
        id="tagNames"
        name="tagNames"
        placeholder="Thẻ bài viết"
        required
        defaultValue={post.tags.map((i) => i.tag.name).join(", ")}
      />
      <Button className="w-full" type="submit">
        Lưu
      </Button>
    </form>
  );
}
