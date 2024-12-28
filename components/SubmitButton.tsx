import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { pending } = useFormStatus();

  return (
    <Button
      color="primary"
      isDisabled={pending}
      isLoading={pending}
      type="submit"
    >
      {children}
    </Button>
  );
}
