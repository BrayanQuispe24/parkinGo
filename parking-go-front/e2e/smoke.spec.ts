import { test, expect } from '@playwright/test';

test('app loads successfully', async ({ page }) => {
  await page.goto('/');
  // Verify that page has a title or root element
  await expect(page).toHaveTitle(/ParkinGo/i);
  const root = page.locator('#root');
  await expect(root).toBeVisible();
});
