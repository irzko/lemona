import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { tv } from "tailwind-variants";
import { FieldError, Merge, FieldErrorsImpl } from "react-hook-form";

const inputStyles = tv({
  base: "bg-gray-50 border border-gray-300 text-sm text-gray-900 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5",
 variants: {
   validation: {
     error: "bg-red-50 border-red-500 text-red-900 placeholder-red-700 focus:ring-red-500 focus:border-red-500"
   }
 }
});

export default function Input({
  label,
  error,
  ...props
}: {
  label?: string;
  error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  return (
    <div>
      {label && (
        <label
          htmlFor={props.id}
          className="block mb-2 text-sm font-medium text-red-700"
        >
          {label}
        </label>
      )}
      <input
        {...props}
        className={inputStyles({ className: props.className, validation: error ? "error" : undefined })}
      ></input>
      {error && <p className="mt-2 text-sm text-red-600">{error.message?.toString()}</p>}
    </div>
  );
}
