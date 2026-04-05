import Link from "next/link";

const footerLink =
  "text-xs font-semibold uppercase tracking-wide text-slate-500 transition hover:text-slate-800";

export default function Footer() {
  return (
    <footer
      id="community"
      className="mt-auto border-t border-slate-200 bg-white py-8"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          © {new Date().getFullYear()} bootNode technical artisan
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/documentation" className={footerLink}>
            Documentation
          </Link>
          <a href="#" className={footerLink}>
            API Reference
          </a>
          <a href="#" className={footerLink}>
            Changelog
          </a>
          <a href="#" className={footerLink}>
            Status
          </a>
          <Link href="/support" className={footerLink}>
            Support
          </Link>
          <Link href="/terms" className={footerLink}>
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
