'use server';

import { withTenantContext } from '@/lib/database/tenant-model';
import UserCourseSummary from '@/models/UserCourseSummary';
import CourseAnalytics from '@/models/CourseAnalytics';
import AuthAnalytics from '@/models/AuthAnalytics';
import GovernanceAnalytics from '@/models/GovernanceAnalytics';

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

/**
 * 🛰️ Server Action to fetch metrics for the active tenant.
 * Automatically wraps queries in `withTenantContext` and falls back to structured mock data if counts are 0.
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return await withTenantContext(async () => {
    try {
      // 1. Gather counts/documents from the dynamic tenant connection
      const [userSummaries, courses, authDoc, govDoc] = await Promise.all([
        UserCourseSummary.find({}).lean(),
        CourseAnalytics.find({}).lean(),
        AuthAnalytics.findOne({}).lean(),
        GovernanceAnalytics.findOne({}).lean()
      ]);

      const hasRealData = userSummaries.length > 0 || courses.length > 0 || !!authDoc || !!govDoc;

      if (!hasRealData) {
        // Return highly realistic mock data for preview (Demo Mode)
        return getMockDashboardMetrics();
      }

      // 2. Parse and consolidate database documents
      const totalStudents = userSummaries.length;
      const completedStudents = userSummaries.filter(u => u.status === 'completed').length;
      const dbCompletionRate = totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0;

      // Extract details from Auth
      const failedLogins24h = authDoc?.failedLogins24h ?? 0;
      const mfaEnrolledRate = authDoc?.mfaEnrolledRate ?? 0;
      const totalLogins24h = authDoc?.totalLogins24h ?? 0;
      const activeSessionsCount = authDoc?.activeSessionsCount ?? 0;
      const mfaBypassActiveCount = authDoc?.mfaBypassActiveCount ?? 0;
      const failedLoginsTimeline = authDoc?.failedLoginsTimeline ?? [];

      // Extract details from Governance
      const totalSpacesCreated = govDoc?.totalSpacesCreated ?? 0;
      const activeCollaboratorsCount = govDoc?.activeCollaboratorsCount ?? 0;
      const licensedApps = (govDoc?.licensedApps ?? []).map(app => ({
        appId: app.appId,
        status: app.status,
        expirationDate: app.expirationDate?.toISOString()
      }));
      const spaceUtilization = govDoc?.spaceUtilization ?? [];
      const storageUsedBytes = spaceUtilization.reduce((acc, curr) => acc + curr.storageBytesUsed, 0);

      // Extract details from Course Analytics
      const mainCourse = courses[0];
      const completionRate = mainCourse?.completionRate ?? dbCompletionRate;
      const averageGrade = mainCourse?.averageGrade ?? 0;
      const gradeDistribution = mainCourse?.gradeDistribution ?? { fail: 0, pass: 0, remarkable: 0, outstanding: 0 };
      const learningCurve = mainCourse?.learningCurve ?? [];
      const distractorTelemetry = mainCourse?.distractorTelemetry ?? [];

      const systemHealth = failedLogins24h > 20 ? 'WARNING' : 'HEALTHY';

      return {
        isDemoMode: false,
        suiteSummary: {
          totalStudents: totalStudents || activeCollaboratorsCount,
          completionRate,
          mfaEnrolledRate,
          storageUsedBytes,
          activeLicensesCount: licensedApps.filter(a => a.status === 'active').length,
          failedLogins24h,
          systemHealth
        },
        lms: {
          completionRate,
          averageGrade,
          gradeDistribution,
          learningCurve,
          distractorTelemetry: distractorTelemetry.map(d => ({
            questionId: d.questionId,
            questionText: d.questionText,
            incorrectRate: d.incorrectRate,
            totalAttempts: d.totalAttempts,
            optionsFrequency: d.optionsFrequency ?? []
          }))
        },
        security: {
          totalLogins24h,
          failedLogins24h,
          mfaEnrolledRate,
          mfaBypassActiveCount,
          failedLoginsTimeline
        },
        governance: {
          totalSpacesCreated,
          activeCollaboratorsCount,
          licensedApps,
          spaceUtilization
        }
      };
    } catch (err) {
      console.error('[DashboardActions] Error querying db, falling back to preview mock data:', err);
      return getMockDashboardMetrics();
    }
  });
}

function getMockDashboardMetrics(): DashboardMetrics {
  return {
    isDemoMode: true,
    suiteSummary: {
      totalStudents: 1420,
      completionRate: 78,
      mfaEnrolledRate: 89,
      storageUsedBytes: 42358000000, // ~42.3 GB
      activeLicensesCount: 3,
      failedLogins24h: 4,
      systemHealth: 'HEALTHY'
    },
    lms: {
      completionRate: 78,
      averageGrade: 74.5,
      gradeDistribution: {
        fail: 8,
        pass: 22,
        remarkable: 55,
        outstanding: 15
      },
      learningCurve: [
        { date: '2026-05-21', averageGrade: 68.2 },
        { date: '2026-05-22', averageGrade: 69.8 },
        { date: '2026-05-23', averageGrade: 71.1 },
        { date: '2026-05-24', averageGrade: 72.4 },
        { date: '2026-05-25', averageGrade: 73.6 },
        { date: '2026-05-26', averageGrade: 74.5 }
      ],
      distractorTelemetry: [
        {
          questionId: 'q-101',
          questionText: '¿Cuál es el puerto por defecto del servicio de analíticas?',
          incorrectRate: 42,
          totalAttempts: 120,
          optionsFrequency: [
            { optionIndex: 0, frequency: 15 }, // Port 3000
            { optionIndex: 1, frequency: 42 }, // Port 3700 (correct but failed rate is high)
            { optionIndex: 2, frequency: 33 }, // Port 3400 (distractor)
            { optionIndex: 3, frequency: 10 }  // Port 80
          ]
        },
        {
          questionId: 'q-102',
          questionText: '¿Qué cabecera HTTP autoriza el SSO inter-servicio?',
          incorrectRate: 35,
          totalAttempts: 120,
          optionsFrequency: [
            { optionIndex: 0, frequency: 35 }, // X-Identity-Token (distractor)
            { optionIndex: 1, frequency: 12 }, // Authorization Bearer
            { optionIndex: 2, frequency: 48 }, // x-internal-iam-key
            { optionIndex: 3, frequency: 5 }  // Cookie
          ]
        }
      ]
    },
    security: {
      totalLogins24h: 3450,
      failedLogins24h: 4,
      mfaEnrolledRate: 89,
      mfaBypassActiveCount: 12,
      failedLoginsTimeline: [
        { hour: '02:00', count: 0 },
        { hour: '06:00', count: 1 },
        { hour: '10:00', count: 0 },
        { hour: '14:00', count: 2 },
        { hour: '18:00', count: 1 },
        { hour: '22:00', count: 0 }
      ]
    },
    governance: {
      totalSpacesCreated: 14,
      activeCollaboratorsCount: 65,
      licensedApps: [
        { appId: 'quiz', status: 'active', expirationDate: '2027-12-31T00:00:00.000Z' },
        { appId: 'auth', status: 'active', expirationDate: '2027-12-31T00:00:00.000Z' },
        { appId: 'gobernanza', status: 'active', expirationDate: '2026-10-15T00:00:00.000Z' }
      ],
      spaceUtilization: [
        { spaceId: 's-1', spaceName: 'Recursos Humanos', totalAssetsCount: 45, storageBytesUsed: 15400000000 },
        { spaceId: 's-2', spaceName: 'Desarrollo de Software', totalAssetsCount: 112, storageBytesUsed: 22100000000 },
        { spaceId: 's-3', spaceName: 'Finanzas e Legal', totalAssetsCount: 22, storageBytesUsed: 4858000000 }
      ]
    }
  };
}
