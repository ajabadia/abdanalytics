import { getTranslations } from 'next-intl/server';
import { ensureIndustrialAccess } from '@/lib/session';
import { LayoutDashboard, Award } from 'lucide-react';
import { AdminPageHeader } from '@abd/styles';
import { GlobalFooter } from '@abd/ecosystem-widgets';

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

        {/* Dashboard Grid - Cascarón Placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="p-6 bg-card border border-border rounded-xl flex flex-col gap-4">
            <div className="p-2.5 bg-secondary/10 border border-border text-primary w-fit rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              {a('title')}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'es'
                ? 'El cuadro de mando unificado de analíticas consolidará las métricas de la suite próximamente.'
                : 'The unified analytics dashboard will consolidate suite metrics here soon.'}
            </p>
          </div>

        </div>

        <GlobalFooter label={t('footer')} opacity={0.8} />

      </div>
    </main>
  );
}
