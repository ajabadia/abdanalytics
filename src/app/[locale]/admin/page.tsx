import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { ensureIndustrialAccess } from '@/lib/session';
import { LayoutDashboard } from 'lucide-react';
import { AdminPageHeader } from '@abd/styles';
import { GlobalFooter } from '@abd/ecosystem-widgets';
import { getDashboardMetrics } from '@/actions/dashboard-actions';
import DashboardClient from '@/components/admin/DashboardClient';
import DashboardSkeleton from '@/components/admin/DashboardSkeleton';

/**
 * 🛰️ Inner Data Wrapper Component that handles DB Querying asynchronously
 */
async function DashboardDataWrapper({ locale }: { locale: string }) {
  const metrics = await getDashboardMetrics();
  return <DashboardClient metrics={metrics} locale={locale} />;
}

/**
 * 🛰️ Central Admin Analytics Portal Page (Federated Server Component)
 */
export default async function AdminPortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('admin');
  const a = await getTranslations('analytics');

  // 🛡️ Ecosystem Identity Guard
  const user = await ensureIndustrialAccess('ADMIN');

  return (
    <main className="min-h-screen bg-background text-foreground p-6 md:p-12 selection:bg-primary/30" role="main">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Header Navigation */}
        <AdminPageHeader
          icon={LayoutDashboard}
          breadcrumb={<>{t('controlConsole')} • DASHBOARD</>}
          title={<>{'ABD'} <span className="text-primary">{a('title')}</span></>}
          description={<>{t('auditDesc')} <span className="text-primary font-bold">{user.tenantId}</span>.</>}
        />

        {/* Dashboard Content under Async Suspense Boundary */}
        <Suspense fallback={<DashboardSkeleton />}>
          <DashboardDataWrapper locale={locale} />
        </Suspense>

        <GlobalFooter label={t('footer')} opacity={0.8} />

      </div>
    </main>
  );
}

