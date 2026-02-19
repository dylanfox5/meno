import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentHeader } from "@/components/content-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { ErrorBoundary } from "@/components/error-boundary";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <ContentHeader title="Dashboard" />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          <DashboardContent />
        </ErrorBoundary>
      </main>
    </ProtectedRoute>
  );
}
