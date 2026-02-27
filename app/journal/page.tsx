import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentHeader } from "@/components/content-header";
import { JournalDashboard } from "@/components/dashboard/journal-dashboard";
import { ErrorBoundary } from "@/components/error-boundary";

export default function JournalPage() {
  return (
    <ProtectedRoute>
      <ContentHeader title="Journal" />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          <JournalDashboard />
        </ErrorBoundary>
      </main>
    </ProtectedRoute>
  );
}
