import mongoose, { Schema, Document } from 'mongoose';
import { getTenantModel } from '@/lib/database/tenant-model';

export interface IGovernanceAnalytics extends Document {
  tenantId: string;
  totalSpacesCreated: number;
  activeCollaboratorsCount: number;
  licensedApps: {
    appId: string;
    status: 'active' | 'suspended' | 'expired';
    expirationDate?: Date;
  }[];
  spaceUtilization: {
    spaceId: string;
    spaceName: string;
    totalAssetsCount: number; // Documentos, corpus vinculados
    storageBytesUsed: number;
  }[];
}

const GovernanceAnalyticsSchema = new Schema<IGovernanceAnalytics>(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    totalSpacesCreated: { type: Number, default: 0 },
    activeCollaboratorsCount: { type: Number, default: 0 },
    licensedApps: [
      {
        appId: { type: String, required: true },
        status: { type: String, enum: ['active', 'suspended', 'expired'], required: true },
        expirationDate: { type: Date }
      }
    ],
    spaceUtilization: [
      {
        spaceId: { type: String, required: true },
        spaceName: { type: String, required: true },
        totalAssetsCount: { type: Number, required: true },
        storageBytesUsed: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default getTenantModel<IGovernanceAnalytics>('GovernanceAnalytics', GovernanceAnalyticsSchema);
