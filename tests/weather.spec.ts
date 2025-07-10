import { test, expect } from '@playwright/test';


test('Weather App basic UI and fetch', async({page}) => {
    await page.goto('/');

    await expect(page.getByText('Vue Weather App')).toBeVisible();

    await page.getByPlaceholder('Enter city name').fill('London');

    await page.getByRole('button',{name : 'Get Weather'}).click();

    await expect(page.locator('.mt-4')).toBeVisible();

    await expect(page.getByText(/London/i)).toBeVisible();


});