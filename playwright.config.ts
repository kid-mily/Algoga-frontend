import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const loadEnvFile = () => {
  const envPaths = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(process.cwd(), ".env.local"),
    path.resolve(process.cwd(), ".env.test"),
    path.resolve(process.cwd(), ".env.test.local"),
  ];

  envPaths.forEach((envPath) => {
    if (!fs.existsSync(envPath)) return;

    const envText = fs.readFileSync(envPath, "utf8");

    envText.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith("#")) return;

      const separatorIndex = trimmedLine.indexOf("=");
      if (separatorIndex === -1) return;

      const key = trimmedLine.slice(0, separatorIndex).trim();
      const value = trimmedLine.slice(separatorIndex + 1).trim();

      if (!key || process.env[key] !== undefined) return;

      process.env[key] = value;
    });
  });
};

loadEnvFile();

export default defineConfig({
  testDir: "./tests",

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: "html",

  use: {
    baseURL: "http://localhost:17000",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:17000",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
