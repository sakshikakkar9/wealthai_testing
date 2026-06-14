import { test, expect } from "@playwright/test";

test("verify audit log and bulk edit", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:5173/transactions");

  // Wait for table
  await page.waitForSelector("table");

  // Open Audit Log
  await page.click("text=Infosys Ltd");
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "../verification/13_audit_log_drawer.png" });

  // Close Audit Log (clicking outside or close button)
  // Re-load to clear state for bulk edit
  await page.goto("http://localhost:5173/transactions");
  await page.waitForSelector("table");

  // Bulk Edit
  // Select first two checkboxes in the table body
  const checkboxes = await page.locator('tbody input[type="checkbox"]').all();
  if (checkboxes.length >= 2) {
    await checkboxes[0].click();
    await checkboxes[1].click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: "../verification/14_bulk_edit_bar.png" });
  }
});
