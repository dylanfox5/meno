import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentHeader } from "@/components/content-header";
import { JournalDashboard } from "@/components/dashboard/journal-dashboard";

export default function JournalPage() {
  return (
    <ProtectedRoute>
      <ContentHeader title="Journal" />
      <main className="flex-1 overflow-auto">
        <JournalDashboard />
      </main>
    </ProtectedRoute>
  );
}
