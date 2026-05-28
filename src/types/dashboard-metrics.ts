/**
 * 🛰️ Consolidated dashboard metrics for the ABD admin dashboard.
 */
export interface DashboardMetrics {
  isDemoMode: boolean;
  suiteSummary: {
    totalStudents: number;
    completionRate: number;
    mfaEnrolledRate: number;
    storageUsedBytes: number;
    activeLicensesCount: number;
    failedLogins24h: number;
    systemHealth: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  };
  lms: {
    completionRate: number;
    averageGrade: number;
    gradeDistribution: {
      fail: number;
      pass: number;
      remarkable: number;
      outstanding: number;
    };
    learningCurve: {
      date: string;
      averageGrade: number;
    }[];
    distractorTelemetry: {
      questionId: string;
      questionText: string;
      incorrectRate: number;
      totalAttempts: number;
      optionsFrequency: {
        optionIndex: number;
        frequency: number;
      }[];
    }[];
  };
  security: {
    totalLogins24h: number;
    failedLogins24h: number;
    mfaEnrolledRate: number;
    mfaBypassActiveCount: number;
    failedLoginsTimeline: {
      hour: string;
      count: number;
    }[];
  };
  governance: {
    totalSpacesCreated: number;
    activeCollaboratorsCount: number;
    licensedApps: {
      appId: string;
      status: 'active' | 'suspended' | 'expired';
      expirationDate?: string;
    }[];
    spaceUtilization: {
      spaceId: string;
      spaceName: string;
      totalAssetsCount: number;
      storageBytesUsed: number;
    }[];
  };
}
