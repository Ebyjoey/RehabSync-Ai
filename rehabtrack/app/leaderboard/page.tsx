import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { LeaderboardContent } from "@/components/gamification/LeaderboardContent";

export default async function LeaderboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  return (
    <DashboardLayout>
      <LeaderboardContent />
    </DashboardLayout>
  );
}
