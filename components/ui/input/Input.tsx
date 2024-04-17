import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const inputStyle = tv({
  base: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
});

export default function Input({
  className,
  ...prop
}: DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>) {
  return <input {...prop} className={inputStyle({ className })} />;
}
