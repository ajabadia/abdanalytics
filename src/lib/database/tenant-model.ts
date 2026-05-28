// ── Backward-compatible re-exports from the canonical @abd/satellite-sdk module ──
//
// This file was previously the main multi-tenant logic (≈130 lines).
// The canonical implementation now lives in @abd/satellite-sdk, consumed by all satellites.
// This re-export layer ensures zero changes to consumers importing from '@/lib/database/tenant-model'.

export type { TenantContext } from '@abd/satellite-sdk';
export { withTenantContext, getTenantModel, tenantStorage, resolveTenantUri, getTenantConnection, ensureConnectionReady } from '@abd/satellite-sdk';
