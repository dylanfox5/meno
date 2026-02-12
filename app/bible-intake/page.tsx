import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentHeader } from "@/components/content-header";
import { BibleIntakeContent } from "@/components/bible-intake/bible-intake-content";

export default function BibleIntakePage() {
  return (
    <ProtectedRoute>
      <ContentHeader title="Bible Intake" />
      <main className="flex-1 overflow-auto">
        <BibleIntakeContent />
      </main>
    </ProtectedRoute>
  );
}
