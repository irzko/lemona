"use client";

import { useActionState } from "react";
import { createCategory } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import { Category } from "@prisma/client";
import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";

export default function CreateCategoryForm({
  categories,
}: {
  categories: Category[];
}) {
  const [state, action] = useActionState(createCategory, undefined);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Tạo danh mục</h1>
      <form className="flex flex-col gap-6 px-4" action={action}>
        <Select name="parentCategoryId">
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id}>
              {category.name}
            </SelectItem>
          ))}
        </Select>
        <Input
          name="name"
          placeholder="Tên danh mục"
          autoComplete="off"
          errorMessage={state?.errors.name}
          isInvalid={!!state?.errors.name?.length}
        />
        <Input placeholder="Mô tả" />
        <SubmitButton>Tạo</SubmitButton>
      </form>
    </div>
  );
}
