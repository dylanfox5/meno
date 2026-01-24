import { ContentHeader } from "@/components/content-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function Home() {
  return (
    <ProtectedRoute>
      <ContentHeader title="Dashboard" />
      <main className="flex-1 overflow-auto">
        <DashboardContent />
      </main>
    </ProtectedRoute>
  );
}