import { test, expect } from '@playwright/test';

test('nyaynow.in loads correctly', async ({ page }) => {
    // Go to your website
    await page.goto('https://nyaynow.in/');

    // Check that the page loaded successfully
    await expect(page).toHaveTitle(/.*Nyaynow.*/i);
});