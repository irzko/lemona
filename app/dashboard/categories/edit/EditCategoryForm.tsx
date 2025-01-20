"use client";

import { useActionState } from "react";
import { updateCategory } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import { Category } from "@prisma/client";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";

export default function EditCategoryForm({
  category,
  allCategories,
}: {
  category: Category;
  allCategories: Category[];
}) {
  const [state, action] = useActionState(updateCategory, undefined);
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Cập nhật danh mục</h1>
      <form
        className="flex flex-col gap-6"
        action={(formData) => {
          formData.append("id", category.id);
          action(formData);
        }}
      >
        <Select
          name="parentCategoryId"
          defaultSelectedKeys={category.parentCategoryId || undefined}
        >
          {allCategories.map((category) => {
            return (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            );
          })}
        </Select>
        <Input
          name="name"
          placeholder="Tên danh mục"
          errorMessage={state?.errors.name}
          isInvalid={!!state?.errors.name?.length}
          defaultValue={category.name}
        />
        <Input
          placeholder="Mô tả"
          defaultValue={category.description || undefined}
        />
        <SubmitButton>Cập nhật</SubmitButton>
      </form>
    </div>
  );
}
