import { defineConfig, devices } from '@playwright/test';

/**
 * 🎭 Playwright Industrial Configuration — ABDAnalytics
 * SmartNavbar E2E tests for public mode.
 *
 * Dev server starts automatically via webServer.
 *
 * ⚠️  REQUIREMENTS:
 *   - Create ABDAnalytics/.env.local with:
 *       AUTH_CLIENT_ID=...
 *       AUTH_CLIENT_SECRET=...
 *       AUTH_JWT_SECRET=...
 *   - MongoDB must be reachable via MONGODB_URI in .env.local
 */
export default defineConfig({
  testDir: './tests',
  globalSetup: './tests/global-setup',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1,
  reporter: 'list',
  timeout: 90000,
  use: {
    baseURL: 'http://localhost:3700',
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3700',
    reuseExistingServer: !process.env.CI,
    timeout: 180000,
    stderr: 'pipe',
  },

  /* 🔐 ABDAuth (port 3400) must be started separately for auth-dependent tests.
     webServer only starts ABDAnalytics's own dev server. */
});
