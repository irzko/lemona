import { auth } from "@/auth";
import PostSidebar from "@/components/PostSidebar";

export default async function Sidebar() {
  const session = await auth();

  return <PostSidebar session={session} />;
}
