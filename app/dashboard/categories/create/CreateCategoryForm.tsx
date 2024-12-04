"use client";

import { useActionState } from "react";
import { createCategory } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/select";
import {Category} from "@prisma/client"

export default function CreateCategoryForm({categories}:{categories: Category[]}) {
  const [state, action] = useActionState(createCategory, undefined);
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Tạo danh mục</h1>
      <form className="flex flex-col gap-6 px-4" action={action}>
        <Select name="parentCategoryId">
          <option selected>Danh mục gốc</option>
          {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
        </Select>
        <Input name="name" placeholder="Tên danh mục" error={state?.errors.name}/>
        <Input placeholder="Mô tả" />
        <SubmitButton>Tạo</SubmitButton>
      </form>
    </div>
  );
}
