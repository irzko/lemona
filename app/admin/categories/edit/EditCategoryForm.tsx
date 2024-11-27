"use client";

import { useActionState } from "react";
import { updateCategory } from "@/app/actions";
import SubmitButton from "@/components/SubmitButton";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/select";
import {Category} from "@prisma/client"


export default function EditCategoryForm({category, allCategories}: {category: Category; allCategories: Category []}) {
  const [state, action] = useActionState(updateCategory, undefined);
  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl font-bold">Cập nhật danh mục</h1>
      <form className="flex flex-col gap-6" action={(formData)=>{
        formData.append("id", category.id);
        action(formData)
      }}>
        <Select defaultValue={category.parentCategoryId || undefined}>
          <option>Danh mục cha</option>
          {allCategories.map((category) =>{
      return <option key={category.id} value={category.id}>{category.name}</option>
          })}
        </Select>
        <Input name="name" placeholder="Tên danh mục" error={state?.errors.name} defaultValue={category.name}/>
        <Input placeholder="Mô tả" defaultValue={category.description || undefined} />
        <SubmitButton>Cập nhật</SubmitButton>
      </form>
    </div>
  );
}
