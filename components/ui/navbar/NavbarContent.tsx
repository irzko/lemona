import { tv } from "tailwind-variants";

const navbarContent = tv({
  base: "h-full flex-row flex-nowrap items-center justify-center hidden sm:flex gap-4",
});

export default function NavbarContent({
  children,
  as,
  className,
}: Readonly<{
  children?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}>) {
  const Component = as || "ul";
  return (
    <Component className={navbarContent({ className })}>{children}</Component>
  );
}
