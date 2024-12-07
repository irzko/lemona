"use client";
import { useState } from "react";
import Input from "@/components/ui/Input";
import { updatePost } from "@/app/actions";
import { $convertToMarkdownString } from "@lexical/markdown";
import { EditorState } from "lexical";
import { PLAYGROUND_TRANSFORMERS } from "@/components/lexical/plugins/MarkdownTransformers";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/select";
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post.categories.map((i) => i.category.id)
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
          defaultValue={selectedCategories[0]}
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
        {selectedCategories.map((selectedCategory, index) => {
          const childCategories = findChildCategories(
            categories,
            selectedCategory
          );
          if (childCategories.length === 0) return null;
          return (
            <div key={selectedCategory}>
              <Select
                defaultValue={selectedCategories[index + 1]}
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
      <Button className="w-full" color="light" type="submit">
        Lưu
      </Button>
    </form>
  );
}
