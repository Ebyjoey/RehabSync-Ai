import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ActivityContent } from "@/components/activity/ActivityContent";

export default async function ActivityPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  return (
    <DashboardLayout>
      <ActivityContent />
    </DashboardLayout>
  );
}
