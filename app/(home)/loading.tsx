import { Spinner } from "@heroui/spinner";
export default function Loading() {
  return (
    <div className="flex justify-center items-center fixed inset-0">
      <Spinner />
    </div>
  );
}
