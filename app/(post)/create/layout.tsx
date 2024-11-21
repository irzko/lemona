import { auth } from "@/auth"
import { SessionProvider } from "next-auth/react"

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  if (session?.user) {
    // TODO: Look into https://react.dev/reference/react/experimental_taintObjectReference
    // filter out sensitive data before passing to client.
    session.user = {
      id: session.user.id,
      role: session.user.role,
      name: session.user.name,
      username: session.user.username,
      image: session.user.image,
    }
  }


  return (
    <SessionProvider basePath="/auth" session={session}>
      {children}
    </SessionProvider>
  )
}