import { mkdirSync } from "fs";
import os from "os";
import path from "path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.SCREENSHOT_BASE_URL || "http://localhost:3000";
const outputDir = path.resolve(process.env.SCREENSHOT_DIR || path.join(os.tmpdir(), "screenshots"));

const publicPages = [
  { name: "public-landing", path: "/" },
  { name: "about", path: "/about" },
  { name: "team", path: "/team" },
  { name: "schedule", path: "/schedule" },
  { name: "blog", path: "/blog" },
];

const customerPages = [
  { name: "customer-dashboard", path: "/customer" },
  { name: "customer-workouts", path: "/customer/workouts" },
  { name: "customer-diet", path: "/customer/diet" },
  { name: "customer-progress", path: "/customer/progress" },
  { name: "customer-sessions", path: "/customer/sessions" },
  { name: "customer-payments", path: "/customer/payments" },
  { name: "customer-rank", path: "/customer/leaderboard" },
];

async function main() {
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });

  for (const item of publicPages) {
    await capture(page, item.name, item.path);
  }

  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle" });
  await page.getByPlaceholder("customer@gym.com").fill("customer@gym.com");
  await page.getByPlaceholder("Enter password").fill("customer12345");
  await page.getByRole("button", { name: /enter the forge/i }).click();
  await page.waitForURL(/\/customer\/dashboard/, { timeout: 15000 });

  for (const item of customerPages) {
    await capture(page, item.name, item.path);
  }

  await browser.close();
  console.log(`Saved ${publicPages.length + customerPages.length} screenshots to ${outputDir}`);
}

async function capture(page: import("@playwright/test").Page, name: string, route: string) {
  const url = `${baseUrl}${route}`;
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));
    const step = Math.max(window.innerHeight * 0.7, 500);
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(120);
    }
    window.scrollTo(0, 0);
    await delay(180);
  });
  await page.screenshot({ path: path.join(outputDir, `${name}.png`), fullPage: true });
  console.log(`${name}: ${url}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
