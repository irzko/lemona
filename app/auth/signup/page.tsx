import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { createUser } from "@/app/actions";

export default function SignUp() {
  return (
    <main className="flex flex-col items-center">
      <div className="max-w-screen-sm w-full p-4">
        <form className="space-y-4" action={createUser}>
          <h3>Tạo tài khoản</h3>
          <Input name="username" type="text" placeholder="Tên người dùng" />
          <Input name="password" type="password" placeholder="Mật khẩu" />
          <Button color="light" className="w-full" type="submit">
            Đăng kí
          </Button>
        </form>
      </div>
    </main>
  );
}
