import AdminHeader from "@/components/admin/AdminHeader";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-folha">
      <AdminHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">{children}</main>
    </div>
  );
}
