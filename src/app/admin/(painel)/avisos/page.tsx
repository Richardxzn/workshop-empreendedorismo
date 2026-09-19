import PostsPanel from "@/components/admin/PostsPanel";

export const metadata = { title: "Avisos" };

export default function AvisosPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold">Avisos do evento</h1>
      <PostsPanel />
    </>
  );
}
