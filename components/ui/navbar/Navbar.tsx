export default function Navbar({
  children,
}: Readonly<{ children?: React.ReactNode }>) {
  return (
    <nav className="flex z-40 w-full h-auto items-center justify-center sticky top-0 inset-x-0 border-b border-b-gray-200 backdrop-blur-lg backdrop-saturate-150 bg-white/70">
      <header className="z-40 flex px-4 gap-4 w-full flex-row relative flex-nowrap items-center justify-between h-16 max-w-screen-lg">
        {children}
      </header>
    </nav>
  );
}
