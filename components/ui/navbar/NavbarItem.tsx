export default function NavbarItem({
  children,
  as,
}: Readonly<{ children?: React.ReactNode; as?: React.ElementType }>) {
  const Component = as || "ul";
  return (
    <Component className="text-medium whitespace-nowrap box-border list-none">
      {children}
    </Component>
  );
}
