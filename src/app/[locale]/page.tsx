import { getTranslations } from 'next-intl/server';
import { ArrowRight, Cpu, Sliders, Database, ShieldCheck } from 'lucide-react';
import { HeroHeader } from '@ajabadia/styles';
import Link from 'next/link';
import { GlobalFooter } from '@ajabadia/ecosystem-widgets';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations('common');
  const h = await getTranslations('home');
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-background text-foreground selection:bg-primary/30 overflow-hidden" role="main">
      {/* Tactical grid background layer */}
      <div className="absolute inset-0 bg-industrial-grid mask-industrial-fade pointer-events-none opacity-50" aria-hidden="true" />

      <div className="z-10 w-full max-w-5xl flex flex-col gap-16 animate-in fade-in duration-500">
        
        {/* Core Brand Header */}
        <HeroHeader
          statusText={h('status')}
          title={
            <>{'ABD'} <span className="text-primary">{h('tenants')}</span></>
          }
          description={h('tagline')}
        />

        {/* Central Tactical Action Area (CTA) */}
        <div className="flex flex-col items-center justify-center gap-4">
          <Link
            href={`/${locale}/admin`}
            className="inline-flex items-center justify-center px-10 py-5 bg-primary text-primary-foreground font-mono text-xs uppercase tracking-widest hover:bg-primary/80 transition-all duration-300 font-black cursor-pointer shadow-lg active:scale-95 border border-primary/30 rounded-lg"
          >
            {h('accessControlPlane')}
            <ArrowRight className="w-4 h-4 ml-3 animate-pulse" />
          </Link>
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
            {locale === 'es' 
              ? 'Inicie sesión con sus credenciales federadas de ABDAuth' 
              : 'Sign in utilizing your federated credentials from ABDAuth'}
          </span>
        </div>

        {/* Tactical Key Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="region" aria-label="System Capabilities">
          
          {/* Feature 1: Business Intelligence / LMS */}
          <div className="p-6 bg-card border border-border rounded-xl flex flex-col gap-4">
            <div className="p-2.5 bg-secondary/10 border border-border text-primary w-fit rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              {locale === 'es' ? 'Capacitación y Desempeño' : 'Training & Performance'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'es'
                ? 'Consolidación de curvas de aprendizaje, tasas de finalización, histogramas de Gauss y telemetría de distractores de ABDQuiz.'
                : 'Consolidation of learning curves, completion rates, Gauss grade distributions, and distractor telemetry from ABDQuiz.'}
            </p>
          </div>

          {/* Feature 2: Governance and Resources */}
          <div className="p-6 bg-card border border-border rounded-xl flex flex-col gap-4">
            <div className="p-2.5 bg-secondary/10 border border-border text-primary w-fit rounded-lg">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              {locale === 'es' ? 'Gobernanza y Recursos' : 'Governance & Resources'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'es'
                ? 'Monitoreo de la utilización espacial de almacenamiento y activos de Spaces, junto al control y vigencia de licencias.'
                : 'Monitoring of spatial resource storage and assets usage in Spaces, alongside licensed application tracking.'}
            </p>
          </div>

          {/* Feature 3: Security & Identity Analytics */}
          <div className="p-6 bg-card border border-border rounded-xl flex flex-col gap-4">
            <div className="p-2.5 bg-secondary/10 border border-border text-primary w-fit rounded-lg">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground">
              {locale === 'es' ? 'Seguridad e Identidad' : 'Security & Identity'}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {locale === 'es'
                ? 'Telemetría operacional de accesos en tiempo real, histórico de logins fallidos, y tasas de adopción de MFA/Passkeys en ABDAuth.'
                : 'Real-time operational access telemetry, timeline of failed logins, and MFA/Passkeys adoption rates from ABDAuth.'}
            </p>
          </div>

        </div>

        <GlobalFooter 
          separatorWidth="short"
          telemetryItems={[
            { label: locale === 'es' ? 'Aplicación' : 'Application', value: h('version') },
            { label: locale === 'es' ? 'Estilo' : 'Style', value: h('style') }
          ]}
        />

      </div>
    </main>
  );
}
