import { test, expect } from '@playwright/test';
import path from 'path';

test('Toggle controls button functionality', async ({ page }) => {
  // 1. Navigate to the app
  await page.goto('http://localhost:5173/');

  // 2. Upload background
  // We need to feed a file to the input[type="file"]
  // Playwright can do this easily.

  // Create a buffer for a dummy image
  const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', 'base64');

  await page.setInputFiles('input[type="file"]', {
    name: 'background.png',
    mimeType: 'image/png',
    buffer: buffer
  });

  // 3. Select a door
  await expect(page.locator('text=Porte Classique')).toBeVisible();
  await page.click('text=Porte Classique');

  // 4. Verify "Masquer" button is visible
  const toggleBtn = page.getByRole('button', { name: 'Masquer' });
  await expect(toggleBtn).toBeVisible();

  // 5. Verify handles are visible initially
  await expect(page.locator('.border-white.cursor-move')).toHaveCount(4);
  await page.screenshot({ path: 'verification/screenshot_controls_visible.png' });

  // 6. Click Toggle
  await toggleBtn.click();

  // 7. Verify button text changed to "Afficher"
  await expect(page.getByRole('button', { name: 'Afficher' })).toBeVisible();

  // 8. Verify handles are GONE
  await expect(page.locator('.border-white.cursor-move')).toHaveCount(0);

  // 9. Verify SVG polygon is GONE
  const svgPolygon = page.locator('svg polygon.cursor-move');
  await expect(svgPolygon).toHaveCount(0);

  await page.screenshot({ path: 'verification/screenshot_controls_hidden.png' });

  // 10. Click Toggle again to show
  await page.getByRole('button', { name: 'Afficher' }).click();
  await expect(page.locator('.border-white.cursor-move')).toHaveCount(4);
});
