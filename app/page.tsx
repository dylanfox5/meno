import { ContentHeader } from "@/components/content-header";
import { DashboardContent } from "@/components/dashboard/dashboard-content";

export default function Home() {
  return (
    <>
      <ContentHeader title="Dashboard" />
      <main className="flex-1 overflow-auto">
        <DashboardContent />
      </main>
    </>
  );
}
