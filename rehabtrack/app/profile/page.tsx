import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProfileContent } from "@/components/dashboard/ProfileContent";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");
  return (
    <DashboardLayout>
      <ProfileContent />
    </DashboardLayout>
  );
}
