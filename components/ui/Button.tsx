import { ReactNode } from "react";
import { tv } from "tailwind-variants";

const buttonStyles = tv({
  base: "flex justify-center items-center gap-2 font-medium tap-highlight-transparent",
  variants: {
    color: {
      default:
        "text-gray-500",
      primary:
        "text-white bg-blue-500 hover:bg-blue-600",
      light:
        "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100",
      danger:
        "focus:outline-none focus:ring-4 bg-red-600 text-white hover:bg-red-700 focus:ring-red-900",
      dark:
        "text-white focus:outline-none focus:ring-4 bg-gray-800 hover:bg-gray-700 focus:ring-gray-700 border-gray-700"
    },

    radius: {
      none: "rounded-none",
      sm: "rounded-sm",
      md: "rounded-md",
      lg: "rounded-lg",
      full: "rounded-full",
    },
    size: {
      sm: "text-xs px-3 min-w-16 h-8",
      md: "text-sm px-4 min-w-20 h-10",
      lg: "text-md px-6 min-w-24 h-12",
    },

    isIconOnly: {
      true: "px-0",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      isIconOnly: true,
      className: "min-w-8 w-8 h-8",
    },
    {
      size: "md",
      isIconOnly: true,
      className: "min-w-10 w-10 h-10",
    },
    {
      size: "lg",
      isIconOnly: true,
      className: "min-w-12 w-12 h-12",
    },
  ],
});

export default function Button({
  children,
  radius = "md",
  size = "md",
  color = "default",
  isIconOnly,
  ...props
}: {
  children: ReactNode;
  radius?: "none" | "sm" | "md" | "lg" | "full";
  size?: "sm" | "md" | "lg";
  color?: "default" | "light" | "danger" | "dark";
  isIconOnly?: boolean;
} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>): JSX.Element {
  return (
    <button
      {...props}
      className={buttonStyles({
        className: props.className,
        radius,
        color,
        size,
        isIconOnly,
      })}
      type={props.type || "button" }
    >
      {children}
    </button>
  );
}