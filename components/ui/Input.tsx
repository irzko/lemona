import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { tv } from "tailwind-variants";

const inputStyles = tv({
  base: "bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
});

export default function Input(
  props: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  return (
    <input
      {...props}
      className={inputStyles({ className: props.className })}
    ></input>
  );
}