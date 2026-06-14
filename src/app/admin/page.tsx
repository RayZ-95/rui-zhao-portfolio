import { AdminEditor } from "@/components/AdminEditor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="border-b border-[#d8d8d8] px-3 py-4">
        <p className="text-[10px] uppercase text-[#999]">Admin</p>
        <h1 className="text-[36px] uppercase leading-none">Content Editor</h1>
      </div>
      <AdminEditor />
    </main>
  );
}
