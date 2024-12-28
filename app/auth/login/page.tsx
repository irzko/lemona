import { signIn } from "@/auth";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";

export default function SignIn() {
  return (
    <main className="flex flex-col items-center">
      <div className="max-w-screen-sm w-full p-4">
        <form
          className="space-y-4"
          action={async (formData) => {
            "use server";
            await signIn("credentials", formData);
          }}
        >
          <h3>Đăng nhập</h3>
          <Input name="username" type="text" placeholder="Tên người dùng" />
          <Input name="password" type="password" placeholder="Mật khẩu" />
          <Button variant="bordered" fullWidth type="submit">
            Đăng nhập
          </Button>
        </form>
      </div>
    </main>
  );
}
