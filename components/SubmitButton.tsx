import { useFormStatus } from "react-dom";
import Button from "@/components/ui/Button";

export default function SubmitButton({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { pending } = useFormStatus();

  return (
    <Button color="primary" disabled={pending} type="submit">
      {children}
    </Button>
  );
}
