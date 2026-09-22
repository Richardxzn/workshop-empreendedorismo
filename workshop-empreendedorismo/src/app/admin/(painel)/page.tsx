import ParticipantsPanel from "@/components/admin/ParticipantsPanel";

export const metadata = { title: "Inscritos" };

export default function InscritosPage() {
  return (
    <>
      <h1 className="font-display text-3xl font-bold">Inscritos</h1>
      <ParticipantsPanel />
    </>
  );
}
