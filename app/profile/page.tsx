import { ProtectedRoute } from "@/components/auth/protected-route";
import { ContentHeader } from "@/components/content-header";
import { getProfile } from "./actions";
import { ProfileForm } from "@/components/profile/profile-form";
import { ErrorBoundary } from "@/components/error-boundary";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    return null;
  }

  return (
    <ProtectedRoute>
      <ContentHeader title="Profile" />
      <main className="flex-1 overflow-auto">
        <ErrorBoundary>
          <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <ProfileForm profile={profile} />
          </div>
        </ErrorBoundary>
      </main>
    </ProtectedRoute>
  );
}