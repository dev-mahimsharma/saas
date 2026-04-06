"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function navClass(active) {
  return active
    ? "border-b-2 border-blue-600 pb-1 text-[15px] font-semibold text-slate-900"
    : "border-b-2 border-transparent pb-1 text-[15px] font-medium text-slate-500 transition hover:text-slate-900";
}

function initialsFor(name, email) {
  const source = name?.trim() || email?.trim() || "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export default function Navbar() {
  const pathname = usePathname();
  const stackActive = pathname === "/stack-explorer";
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const callbackUrl = useMemo(() => {
    const safePath = pathname && pathname !== "/auth/signin" ? pathname : "/templates";
    return `/auth/signin?callbackUrl=${encodeURIComponent(safePath)}`;
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const user = session?.user;
  const userInitials = initialsFor(user?.name, user?.email);
  const userName = user?.name || "Signed in user";
  const userEmail = user?.email || "No email available";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-[#F9FAFB]/95 backdrop-blur">
      <div className="mx-auto flex h-20 w-full items-center justify-between gap-4 px-6 md:px-12">
        <div className="flex items-center gap-8 lg:gap-14">
          <Link
            href="/"
            className="flex items-center text-2xl font-black tracking-tight text-slate-900"
          >
            bootNode
          </Link>
          <nav className="hidden items-center gap-8 pt-1 md:flex" aria-label="Main">
            <Link
              href="/templates"
              className={navClass(
                pathname === "/templates" ||
                  pathname === "/web-development" ||
                  pathname === "/app-development"
              )}
            >
              Templates
            </Link>
            <Link href="/stack-explorer" className={navClass(stackActive)}>
              Stack Explorer
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          {status === "authenticated" && user ? (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex cursor-pointer items-center justify-center rounded-full overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm ring-2 ring-transparent hover:ring-blue-300 w-11 h-11"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={userName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center bg-blue-600 text-[15px] font-black tracking-widest text-white">
                    {userInitials}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 5, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-200 bg-white shadow-md overflow-hidden"
                  >
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                       <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden shadow-sm">
                          {user.image ? (
                            <img src={user.image} alt={userName} className="w-full h-full object-cover" />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center bg-blue-600 text-sm font-black text-white">{userInitials}</span>
                          )}
                       </div>
                       <div className="min-w-0">
                         <p className="truncate font-bold text-slate-900 text-[15px] leading-tight">{userName}</p>
                         <p className="truncate text-xs text-slate-500 font-medium">{userEmail}</p>
                       </div>
                    </div>

                    <div className="p-4 space-y-4 bg-white">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5 px-1">Full Name</label>
                        <div className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed opacity-80 select-none">
                          {userName}
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1.5 px-1">Email Address</label>
                        <div className="w-full bg-slate-50 border border-slate-100 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-500 cursor-not-allowed opacity-80 select-none truncate">
                          {userEmail}
                        </div>
                      </div>
                    </div>

                    <div className="p-2 border-t border-slate-100 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 px-4 py-3 text-[14px] font-bold text-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        Log out safely
                      </button>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href={callbackUrl}
              className="hidden text-[15px] font-bold text-slate-600 hover:text-slate-900 sm:block tracking-wide cursor-pointer"
            >
              Log in
            </Link>
          )}
          <Link
            href="/templates"
            className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#0052cc] px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#0047b3] focus:ring-4 focus:ring-blue-100"
          >
            Start Building
          </Link>
        </div>
      </div>
    </header>
  );
}
