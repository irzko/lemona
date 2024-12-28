"use client";

import { useActionState } from "react";
import SubmitButton from "@/components/SubmitButton";

import { createUser } from "@/app/actions";
import { Input } from "@nextui-org/input";

export function SignupForm() {
  const [state, action] = useActionState(createUser, undefined);

  return (
    <form className="flex gap-6 flex-col" action={action}>
      <Input
        label="Tên người dùng"
        name="username"
        placeholder="Nhập tên người dùng"
        errorMessage={state?.errors.username}
        isInvalid={!!state?.errors.username?.length}
      />
      <Input
        label="Mật khẩu"
        name="password"
        placeholder="Nhập mật khẩu"
        errorMessage={state?.errors.password}
        isInvalid={!!state?.errors.password?.length}
      />

      <SubmitButton>Đăng ký</SubmitButton>
    </form>
  );
}
