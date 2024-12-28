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
import { findChildCategories } from "@/lib/findChildCategories";
import { Input } from "@nextui-org/input";
import { Select, SelectItem } from "@nextui-org/select";
import { Button } from "@nextui-org/button";

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
        <Select
          defaultSelectedKeys={selectedCategoryIds[0] || ""}
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
          selectedCategoryIds.map((selectedCategoryId, index) => {
            const childCategories = findChildCategories(
              categories,
              selectedCategoryId || null
            );
            if (childCategories.length === 0) return null;
            return (
              <Select
                key={`child-${selectedCategoryIds[index]}`}
                defaultSelectedKeys={selectedCategoryIds[index + 1] || ""}
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
