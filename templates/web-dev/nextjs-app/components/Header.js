import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          Bootnode
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          Home
        </Link>
      </nav>
    </header>
  );
}
