"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function navClass(active) {
  return active
    ? "border-b-2 border-blue-600 pb-1 text-[15px] font-semibold text-slate-900"
    : "text-[15px] font-medium text-slate-500 transition hover:text-slate-900 border-b-2 border-transparent pb-1";
}

export default function Navbar() {
  const pathname = usePathname();
  const stackActive = pathname === "/stack-explorer";

  return (
    <header className="sticky top-0 z-50 bg-[#F9FAFB] border-b border-slate-200">
      <div className="mx-auto flex h-20 w-full items-center justify-between gap-4 px-6 md:px-12">
        <div className="flex items-center gap-8 lg:gap-14">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-slate-900 font-sans flex items-center"
          >
            Slate Nova
          </Link>
          <nav className="hidden items-center gap-8 md:flex pt-1" aria-label="Main">
            <Link href="/templates" className={navClass(pathname === "/templates" || pathname === "/web-development" || pathname === "/app-development")}>
              Templates
            </Link>
            <Link href="/stack-explorer" className={navClass(stackActive)}>
              Stack Explorer
            </Link>
            <a
              href="#community"
              className="text-[15px] font-medium text-slate-500 transition hover:text-slate-900 border-b-2 border-transparent pb-1"
            >
              Community
            </a>
          </nav>
        </div>
        <div className="flex items-center gap-8">
          <Link
            href="/auth/signin"
            className="text-[15px] font-medium text-slate-600 hover:text-slate-900 hidden sm:block"
          >
            Sign In
          </Link>
          <Link
            href="/web-development"
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-2.5 text-[15px] font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            Build Project
          </Link>
        </div>
      </div>
    </header>
  );
}
