"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function AppLayoutManager({ children }) {
  const pathname = usePathname();
  const isHero = pathname === "/";

  return (
    <>
      {!isHero && <Navbar />}
      <div className="flex flex-1 flex-col">{children}</div>
      {!isHero && <Footer />}
    </>
  );
}
