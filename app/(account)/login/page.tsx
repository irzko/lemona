import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
    >
      <label>
        Tên tài khoản
        <input name="username" type="text" />
      </label>
      <label>
        Mật khẩu
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  )
}