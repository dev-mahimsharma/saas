/**
 * src/app: This folder contains the Next.js App Router routing logic and global layout structures.
 */
import { ThemeProvider } from "@/context/ThemeContext";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import "./globals.css";

export const metadata = {
  title: "Professional Next.js Architecture",
  description: "A production-ready robust boilerplate",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <div className="layout-wrapper">
            <Header />
            <main className="main-content">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
