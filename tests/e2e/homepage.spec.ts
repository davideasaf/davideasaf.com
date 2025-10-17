import { test, expect } from "@playwright/test";

/**
 * Homepage E2E Smoke Tests
 *
 * These tests verify that the homepage loads correctly and displays
 * core content. This is part of the primary user flow testing suite.
 *
 * Related issues: #21, #22
 */

test.describe("Homepage", () => {
  test("should load homepage successfully", async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");

    // Verify the page loads and has expected title
    await expect(page).toHaveTitle(/David Asaf/);

    // Verify the page is not showing error state
    const bodyText = await page.textContent("body");
    expect(bodyText).not.toContain("404");
    expect(bodyText).not.toContain("Error");
  });

  test("should display hero section", async ({ page }) => {
    await page.goto("/");

    // Look for the hero section or main heading
    // Adjust selector based on actual homepage structure
    const mainContent = page.locator("main, [role='main'], .hero, h1").first();
    await expect(mainContent).toBeVisible();
  });

  test("should have working navigation", async ({ page }) => {
    await page.goto("/");

    // Look for navigation elements
    const nav = page.locator("nav, [role='navigation'], header a").first();
    await expect(nav).toBeVisible();
  });

  test("should be responsive on mobile", async ({ page }) => {
    // Set mobile viewport before navigating
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto("/");

    // Verify page loads on mobile viewport
    await expect(page).toHaveTitle(/David Asaf/);

    // Wait for page to be fully loaded
    await page.waitForLoadState("networkidle");

    // Check that the page body is visible (more reliable than main on mobile)
    await expect(page.locator("body")).toBeVisible();

    // Verify content is rendered (check for common elements)
    const hasContent =
      (await page.locator("h1, h2, header").count()) > 0 ||
      (await page.locator("main").count()) > 0;
    expect(hasContent).toBeTruthy();
  });
});
