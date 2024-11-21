import { createUser } from "@/app/actions";

export default function SignUp() {
  return (
    <form action={createUser}>
      <label>
        Tên người dùng
        <input name="username" type="text" />
      </label>
      <label>
        Mật khẩu
        <input name="password" type="password" />
      </label>
      <button>Đăng kí</button>
    </form>
  );
}
