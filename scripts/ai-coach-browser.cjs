// Read-only smoke check: no workout metrics are written to MongoDB.
const { chromium, expect } = require("@playwright/test");
const path = require("node:path");
const os = require("node:os");

async function main() {
  const baseURL = process.env.COACH_BASE_URL || "http://localhost:3000";
  const browser = await chromium.launch({
    headless: true,
    channel: process.env.COACH_BROWSER_CHANNEL || "msedge",
    args: ["--use-fake-device-for-media-stream"],
  });
  try {
    const context = await browser.newContext({ baseURL });
    for (const route of [
      "/api/customer/ai-coach/sessions",
      "/api/ai-coach/sessions",
    ]) {
      const response = await context.request.get(route);
      expect(response.status()).toBe(401);
    }
    console.log("Unauthenticated session endpoints: 401");
    const login = await context.request.post("/api/auth/login", {
      data: {
        email: process.env.COACH_TEST_EMAIL || "customer@gym.com",
        password: process.env.COACH_TEST_PASSWORD || "customer12345",
      },
    });
    expect(login.status(), "Existing demo customer login").toBe(200);
    const history = await context.request.get('/api/customer/ai-coach/sessions');
    expect(history.status(), 'Authenticated MongoDB workout history').toBe(200);
    expect(Array.isArray((await history.json()).sessions)).toBe(true);
    const invalid = await context.request.post('/api/customer/ai-coach/sessions', { data: { customerId: 'spoofed-owner' } });
    expect(invalid.status(), 'Invalid metrics cannot be persisted').toBe(400);
    const page = await context.newPage();
    const failures = [];
    page.on("pageerror", (error) => failures.push(error.message));
    await page.goto("/customer");
    await expect(page.getByRole("link", { name: "Home", exact: true })).toBeVisible();
    await expect(page.getByText(/MEMBER SPACE|CUSTOMER SPACE|TRAINER SPACE|OWNER SPACE/)).toHaveCount(0);
    await page.getByRole("button", { name: "More", exact: true }).click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.locator("#workspace-content").click({ position: { x: 10, y: 10 } });
    await expect(page.getByRole("menu")).toBeHidden();
    await page.goto("/customer/ai-coach");
    await expect(
      page.getByRole("heading", { name: "Choose your exercise" }),
    ).toBeVisible();
    await page.getByRole("tab", { name: "Ask Coach", exact: true }).click();
    await expect(
      page.getByRole("tab", { name: "Ask Coach", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await page.getByRole("tab", { name: "Posture Coach", exact: true }).click();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: path.join(os.tmpdir(), "iron-forge-coach-mobile.png"),
      fullPage: true,
      animations: "disabled",
    });
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page
      .getByRole("button", { name: "Enable camera & start AI coach" })
      .click();
    // Real MediaPipe assets load; headless Chromium has no camera permission.
    await expect(
      page
        .getByRole("region", { name: "Live posture camera" })
        .getByRole("alert"),
    ).toContainText(/camera permission denied|no camera found/i, {
      timeout: 120000,
    });
    await context.grantPermissions(["camera"]);
    await page.getByRole("button", { name: "Retry camera" }).click();
    await expect(page.getByText("Camera live", { exact: false })).toBeVisible({
      timeout: 120000,
    });
    await expect(
      page.getByText("Step into frame", { exact: false }),
    ).toBeVisible({ timeout: 30000 });
    const track = await page
      .locator("video")
      .evaluateHandle((video) => video.srcObject.getVideoTracks()[0]);
    await page.getByRole("button", { name: "Pause", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Resume", exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Resume", exact: true }).click();
    await page.getByRole("button", { name: "Finish workout" }).click();
    expect(await track.evaluate((track) => track.readyState)).toBe("ended");
    await expect(
      page.getByRole("button", { name: "Save session" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Train again" }).click();
    await expect(
      page.getByRole("heading", { name: "Choose your exercise" }),
    ).toBeVisible();
    await page.goto("/customer/progress");
    await expect(
      page.getByRole("heading", { name: "AI Form Progress" }),
    ).toBeVisible();
    expect(failures).toEqual([]);
    console.log(
      "Coach tabs, mobile layout, MediaPipe initialization/inference, camera denial/retry, no-pose, pause/resume, camera teardown, empty-session guard, progress: passed",
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
