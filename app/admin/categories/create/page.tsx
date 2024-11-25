"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const formSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên danh mục"}).max(255),
  description: z.string().max(500).optional(),
});

export default function CreateCategoryPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
  });
const onSubmit = (data: any) => console.log(data);
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Tạo danh mục</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Tên danh mục" {...register('name')} error={errors.name}/>
        <Input placeholder="Mô tả" {...register('description')} error={errors.description}/>
        <Button type="submit">Create Category</Button>
      </form>
    </div>
  );
}
