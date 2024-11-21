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
      name: session.user.name,
    }
  }

  return (
    <SessionProvider basePath="/auth" session={session}>
      {children}
    </SessionProvider>
  )
}