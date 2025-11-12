import "../globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Admin Panel",
  description: "Admin panel for managing jobs, applications, and blogs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-screen overflow-x-hidden">
      <Navbar />
      <div className="flex w-full">
        <aside className="hidden md:flex md:w-64 md:flex-shrink-0">
          <Sidebar />
        </aside>
        <main className="flex-1 min-w-0 w-full p-4 md:p-6">
          <div className="max-w-7xl mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
