import mongoose, { Schema, Document } from 'mongoose';
import { getTenantModel } from '@ajabadia/satellite-sdk';

export interface IAuthAnalytics extends Document {
  tenantId: string;
  totalLogins24h: number;
  failedLogins24h: number;
  activeSessionsCount: number;
  mfaEnrolledRate: number; // Porcentaje de usuarios con MFA activado
  mfaBypassActiveCount: number; // Usuarios usando el período de gracia de MFA
  failedLoginsTimeline: {
    hour: string; // Formato HH:00
    count: number;
  }[];
}

const AuthAnalyticsSchema = new Schema<IAuthAnalytics>(
  {
    tenantId: { type: String, required: true, unique: true, index: true },
    totalLogins24h: { type: Number, default: 0 },
    failedLogins24h: { type: Number, default: 0 },
    activeSessionsCount: { type: Number, default: 0 },
    mfaEnrolledRate: { type: Number, default: 0 },
    mfaBypassActiveCount: { type: Number, default: 0 },
    failedLoginsTimeline: [
      {
        hour: { type: String, required: true },
        count: { type: Number, required: true }
      }
    ]
  },
  { timestamps: true }
);

export default getTenantModel<IAuthAnalytics>('AuthAnalytics', AuthAnalyticsSchema);
