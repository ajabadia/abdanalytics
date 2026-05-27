import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';

// Mock @abd/satellite-sdk to avoid importing next/server inside tests
vi.mock('@abd/satellite-sdk', () => {
  return {
    getIndustrialSession: vi.fn().mockResolvedValue({
      authenticated: true,
      user: {
        tenantId: 'test-tenant-123',
        dbPrefix: 't123',
        isolationStrategy: 'COLLECTION_PREFIX',
      },
    }),
  };
});

import mongoose from 'mongoose';
import { withTenantContext } from '@/lib/database/tenant-model';
import UserCourseSummary from './UserCourseSummary';
import CourseAnalytics from './CourseAnalytics';
import AuthAnalytics from './AuthAnalytics';
import GovernanceAnalytics from './GovernanceAnalytics';

interface MockConnection {
  models: Record<string, unknown>;
  model: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  close: ReturnType<typeof vi.fn>;
  readyState: number;
}

describe('Analytics Models & Multi-Tenancy', () => {
  let mockConnection: MockConnection;
  let originalMongoUri: string | undefined;

  beforeAll(() => {
    // Preserve and mock MONGODB_URI env var
    originalMongoUri = process.env.MONGODB_URI;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/abd_analytics_test';

    // Mock mongoose.createConnection to avoid making real database connections during tests
    mockConnection = {
      models: {},
      model: vi.fn().mockImplementation((name, schema, collection) => {
        const dummyModel = {
          modelName: name,
          schema,
          collection: { name: collection || name },
          find: vi.fn(),
          findOne: vi.fn(),
          create: vi.fn(),
        };
        mockConnection.models[name] = dummyModel;
        return dummyModel;
      }),
      on: vi.fn(),
      close: vi.fn().mockResolvedValue(undefined),
      readyState: 1,
    };

    vi.spyOn(mongoose, 'createConnection').mockReturnValue(mockConnection as unknown as mongoose.Connection);
  });

  afterAll(() => {
    process.env.MONGODB_URI = originalMongoUri;
    vi.restoreAllMocks();
  });

  describe('Model Definitions', () => {
    it('should define UserCourseSummary model with correct schema properties', () => {
      expect(UserCourseSummary).toBeDefined();
      expect(UserCourseSummary.modelName).toBe('UserCourseSummary');
      const paths = UserCourseSummary.schema.paths;
      expect(paths.tenantId).toBeDefined();
      expect(paths.userId).toBeDefined();
      expect(paths.courseId).toBeDefined();
      expect(paths.averageGrade).toBeDefined();
      expect(paths.status).toBeDefined();
    });

    it('should define CourseAnalytics model with correct schema properties', () => {
      expect(CourseAnalytics).toBeDefined();
      expect(CourseAnalytics.modelName).toBe('CourseAnalytics');
      const paths = CourseAnalytics.schema.paths;
      expect(paths.tenantId).toBeDefined();
      expect(paths.courseId).toBeDefined();
      expect(paths.completionRate).toBeDefined();
      expect(paths['gradeDistribution.fail']).toBeDefined();
      expect(paths['gradeDistribution.pass']).toBeDefined();
      expect(paths.distractorTelemetry).toBeDefined();
    });

    it('should define AuthAnalytics model with correct schema properties', () => {
      expect(AuthAnalytics).toBeDefined();
      expect(AuthAnalytics.modelName).toBe('AuthAnalytics');
      const paths = AuthAnalytics.schema.paths;
      expect(paths.tenantId).toBeDefined();
      expect(paths.totalLogins24h).toBeDefined();
      expect(paths.mfaEnrolledRate).toBeDefined();
      expect(paths.failedLoginsTimeline).toBeDefined();
    });

    it('should define GovernanceAnalytics model with correct schema properties', () => {
      expect(GovernanceAnalytics).toBeDefined();
      expect(GovernanceAnalytics.modelName).toBe('GovernanceAnalytics');
      const paths = GovernanceAnalytics.schema.paths;
      expect(paths.tenantId).toBeDefined();
      expect(paths.totalSpacesCreated).toBeDefined();
      expect(paths.licensedApps).toBeDefined();
      expect(paths.spaceUtilization).toBeDefined();
    });
  });

  describe('Multi-Tenant Model Routing', () => {
    it('should route to tenant-specific collection/database when context is active', async () => {
      const tenantCtx = {
        tenantId: 'test-tenant-123',
        dbPrefix: 't123',
        isolationStrategy: 'COLLECTION_PREFIX',
      };

      await withTenantContext(async () => {
        // Accessing a property on the proxy triggers getModelForTenant / getTenantConnection
        // We call a method like find to trigger the getter
        UserCourseSummary.find();

        // Verify that compileModelOnConnection was called on mockConnection
        expect(mockConnection.model).toHaveBeenCalled();
        
        // Under COLLECTION_PREFIX strategy, it should compile with prefixed collection name
        const modelMock = mockConnection.model as unknown as { mock: { calls: [string, unknown, string][] } };
        const lastCallArgs = modelMock.mock.calls[modelMock.mock.calls.length - 1];
        expect(lastCallArgs[0]).toBe('UserCourseSummary');
        expect(lastCallArgs[2]).toBe('t123_usercoursesummaries'); // mongoose pluralizes and lowercases default collections
      }, tenantCtx);
    });

    it('should route to DATABASE_PER_TENANT connection when strategy is set', async () => {
      const tenantCtx = {
        tenantId: 'test-tenant-456',
        dbPrefix: 't456',
        isolationStrategy: 'DATABASE_PER_TENANT',
      };

      // Reset createConnection mock track
      const createConnectionSpy = vi.spyOn(mongoose, 'createConnection');

      await withTenantContext(async () => {
        CourseAnalytics.find();
        
        // It should call mongoose.createConnection with a modified URI containing the tenant database name
        expect(createConnectionSpy).toHaveBeenCalled();
        const callArgs = createConnectionSpy.mock.calls[createConnectionSpy.mock.calls.length - 1] as unknown as string[];
        const uriUsed = callArgs[0];
        expect(uriUsed).toContain('abd_tenant_t456');
      }, tenantCtx);
    });
  });
});
