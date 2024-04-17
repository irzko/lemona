import { DetailedHTMLProps, SelectHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const selectStyles = tv({
  base: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
});

export default function Select({
  children,
  className,
  ...prop
}: Readonly<
  { children: React.ReactNode } & DetailedHTMLProps<
    SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
>) {
  return (
    <select {...prop} className={selectStyles({ className })}>
      {children}
    </select>
  );
}
