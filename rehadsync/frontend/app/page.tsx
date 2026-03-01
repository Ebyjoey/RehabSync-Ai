import ActivityDetector from "@/components/games/ActivityDetector";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">RehadSync</h1>
      <ActivityDetector />
    </main>
  );
}