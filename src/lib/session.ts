// Re-export canonical session helpers from @abd/satellite-sdk
// This file is a transitional shim — migrate imports to @abd/satellite-sdk directly
'use server';

export { getIndustrialSession, ensureIndustrialAccess } from '@abd/satellite-sdk';
export type { FederatedSession, UserProfile } from '@abd/satellite-sdk';
