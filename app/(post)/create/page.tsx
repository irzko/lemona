import PostCreationForm from "@/components/PostCreationForm";

import { auth } from "@/auth";
export default async function Page() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <>
      <PostCreationForm authorId={session.user.id as string} />
    </>
  );
}
