import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentHeader } from "@/components/content-header";
import { PrayerContent } from "@/components/prayer/prayer-content";
import { ErrorBoundary } from "@/components/error-boundary";

export default function PrayerPage() {
  return (
    <ProtectedRoute>
      <ContentHeader title="Prayer" />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          <PrayerContent />
        </ErrorBoundary>
      </main>
    </ProtectedRoute>
  );
}
