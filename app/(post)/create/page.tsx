import PostCreationForm from "@/components/PostCreationForm";

import { auth } from "@/auth";
export default async function Page() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-4 space-y-4">
        <h1 className="text-2xl font-bold">Create a new post</h1>
        <PostCreationForm authorId={session.user.id as string} />
      </div>
    </div>
  );
}
