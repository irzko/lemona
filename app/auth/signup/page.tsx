import {SignupForm }from "@/components/ui/signup-form"



export default function SignUpPage() {
  return (
    <main className="flex flex-col items-center">
      <div className="max-w-screen-sm w-full p-4">
        <h1 className="text-2xl font-bold">Tham gia Lemona</h1>
        <SignupForm />
      </div>
    </main>
  );
}
