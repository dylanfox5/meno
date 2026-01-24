import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentHeader } from "@/components/content-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ContentHeader title="Dashboard" />
      <main className="flex-1 overflow-auto">
        <DashboardContent />
      </main>
    </ProtectedRoute>
  );
}
