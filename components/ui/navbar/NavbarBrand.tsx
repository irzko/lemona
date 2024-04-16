import React from "react";

export default function NavbarBrand({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  return (
    <div className="flex basis-0 flex-row flex-grow flex-nowrap justify-start bg-transparent items-center no-underline text-medium whitespace-nowrap box-border">
      {children}
    </div>
  );
}
