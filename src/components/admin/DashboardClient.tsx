'use client';

import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import type { DashboardMetrics } from '@/actions/dashboard-actions';
import SuiteTab from './tabs/SuiteTab';
import LmsTab from './tabs/LmsTab';
import SecurityTab from './tabs/SecurityTab';
import GovernanceTab from './tabs/GovernanceTab';

interface DashboardClientProps {
  metrics: DashboardMetrics;
  locale: string;
}

export default function DashboardClient({ metrics, locale }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<'suite' | 'lms' | 'security' | 'governance'>('suite');

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* ⚠️ Omnipresent Demo Mode Audit Banner */}
      {metrics.isDemoMode && (
        <div 
          className="relative overflow-hidden border border-warning/30 bg-warning/5 p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
            <div className="flex flex-col">
              <span className="font-mono text-xs font-black uppercase tracking-widest text-warning">
                {locale === 'es' 
                  ? '[ADVERTENCIA DE AUDITORÍA] SISTEMA EN MODO PREVIEW - DATOS SIMULADOS' 
                  : '[AUDIT WARNING] SISTEMA EN MODO PREVIEW - DATOS SIMULADOS'}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                {locale === 'es'
                  ? 'La base de datos actual está vacía para este Tenant. Mostrando capa analítica simulada para propósitos de demostración técnica.'
                  : 'La base de datos actual está vacía para este Tenant. Mostrando capa analítica simulada para propósitos de demostración técnica.'}
              </span>
            </div>
          </div>
          <div className="px-3 py-1 border border-warning/40 text-[9px] font-mono text-warning uppercase font-bold tracking-widest bg-warning/10 select-none">
            {locale === 'es' ? 'MODO_DEMO_ACTIVO' : 'DEMO_MODE_ACTIVE'}
          </div>
        </div>
      )}

      {/* Tabs navigation in compliance with industrial design */}
      <div className="flex flex-wrap gap-2 border-b border-border/40 pb-px" role="tablist">
        <button aria-label="Suite Summary Tab"
          onClick={() => setActiveTab('suite')}
          className={`px-5 py-3 font-mono text-xs uppercase tracking-widest border transition-all duration-150 rounded-none cursor-pointer ${
            activeTab === 'suite'
              ? 'border-primary border-b-transparent bg-primary/5 text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20'
          }`}
          role="tab"
          aria-selected={activeTab === 'suite'}
        >
          {locale === 'es' ? 'RESUMEN SUITE' : 'SUITE SUMMARY'}
        </button>
        <button aria-label="LMS Analytics Tab"
          onClick={() => setActiveTab('lms')}
          className={`px-5 py-3 font-mono text-xs uppercase tracking-widest border transition-all duration-150 rounded-none cursor-pointer ${
            activeTab === 'lms'
              ? 'border-primary border-b-transparent bg-primary/5 text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20'
          }`}
          role="tab"
          aria-selected={activeTab === 'lms'}
        >
          LMS (ABDQUIZ)
        </button>
        <button aria-label="Security Analytics Tab"
          onClick={() => setActiveTab('security')}
          className={`px-5 py-3 font-mono text-xs uppercase tracking-widest border transition-all duration-150 rounded-none cursor-pointer ${
            activeTab === 'security'
              ? 'border-primary border-b-transparent bg-primary/5 text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20'
          }`}
          role="tab"
          aria-selected={activeTab === 'security'}
        >
          {locale === 'es' ? 'SEGURIDAD (ABDAUTH)' : 'SECURITY (ABDAUTH)'}
        </button>
        <button aria-label="Governance Analytics Tab"
          onClick={() => setActiveTab('governance')}
          className={`px-5 py-3 font-mono text-xs uppercase tracking-widest border transition-all duration-150 rounded-none cursor-pointer ${
            activeTab === 'governance'
              ? 'border-primary border-b-transparent bg-primary/5 text-primary font-bold'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary/20'
          }`}
          role="tab"
          aria-selected={activeTab === 'governance'}
        >
          {locale === 'es' ? 'GOBERNANZA' : 'GOVERNANCE'}
        </button>
      </div>

      {/* Tab Panels */}
      <div className="min-h-[400px]">
        {activeTab === 'suite' && <SuiteTab metrics={metrics} locale={locale} />}
        {activeTab === 'lms' && <LmsTab metrics={metrics} locale={locale} />}
        {activeTab === 'security' && <SecurityTab metrics={metrics} locale={locale} />}
        {activeTab === 'governance' && <GovernanceTab metrics={metrics} locale={locale} />}
      </div>
    </div>
  );
}
