"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";

import { createUser } from "@/app/actions";
import Input from "@/components/ui/Input";

export function SignupForm() {
  const [state, action] = useActionState(createUser, undefined);

  return (
    <form className="flex gap-6 flex-col" action={action}>
      <Input
        label="Tên người dùng"
        name="username"
        placeholder="Nhập tên người dùng"
        error={state?.errors.username}
      />
      <Input
        label="Mật khẩu"
        name="password"
        placeholder="Nhập mật khẩu"
        error={state?.errors.password}
      />

      <SubmitButton>Đăng ký</SubmitButton>
    </form>
  );
}
