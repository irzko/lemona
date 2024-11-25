"use client";

import { useActionState } from "react";
import { createCategory } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/select";

export default function CreateCategoryPage() {
  const [state, action] = useActionState(createCategory, undefined);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Tạo danh mục</h1>
      <form action={action}>
        <Select>
          <option>Chọn danh mục cha</option>
        </Select>
        <Input placeholder="Tên danh mục" error={state?.errors.name}/>
        <Input placeholder="Mô tả" />
        <SubmitButton>Tạo</SubmitButton>
      </form>
    </div>
  );
}
