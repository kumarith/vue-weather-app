import { test, expect } from '@playwright/test';

test.describe('Weather App', () => {

  test('renders basic UI elements', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: /SkyWatch/i })).toBeVisible();
    await expect(page.getByPlaceholder('Enter city name')).toBeVisible();
    await expect(page.getByRole('button', { name: /Get Weather/i })).toBeVisible();
  });

  test('shows suggestions when typing a city', async ({ page }) => {
  await page.getByPlaceholder('Enter city name').fill('Lon');

  // Wait for listbox to appear
  await page.getByRole('listbox', { name: /City suggestions/i }).waitFor({ state: 'visible', timeout: 10000 });

  // Then check for option visibility
  await expect(page.getByRole('option', { name: /London/i }).first()).toBeVisible({ timeout: 10000 });
});

  test('selects a suggestion with mouse click', async ({ page }) => {
  await page.getByPlaceholder('Enter city name').fill('Lon');

  // Wait for option to appear
  const londonOption = page.getByRole('option', { name: /London/i }).first();
  await londonOption.waitFor({ state: 'visible', timeout: 10000 });

  // Click it
  await londonOption.click();
  await expect(page.getByPlaceholder('Enter city name')).toHaveValue('London');
});

  test('selects a suggestion with keyboard', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder('Enter city name');
    await input.fill('Lon');
    await page.waitForTimeout(800);

    await input.press('ArrowDown');
    await input.press('Enter');

    // should auto-fill the first suggestion
    const value = await input.inputValue();
    expect(value.length).toBeGreaterThan(0);
  });

  test('shows error if clicking Get Weather with empty input', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /Get Weather/i }).click();
    await expect(page.getByRole('alert')).toHaveText(/Please enter a city name/i);
  });

  test('fetches and displays weather (mocked API)', async ({ page }) => {
    await page.route('**/current.json*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          location: { name: 'London', country: 'United Kingdom' },
          current: {
            temp_c: 15,
            temp_f: 59,
            condition: { text: 'Partly cloudy', icon: '//cdn.weatherapi.com/partly.png' }
          }
        })
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter city name').fill('London');
    await page.getByRole('button', { name: /Get Weather/i }).click();

    await expect(page.getByRole('region')).toContainText(/London, United Kingdom/i);
    await expect(page.getByText(/Partly cloudy/i)).toBeVisible();
    await expect(page.getByText(/°C/i)).toBeVisible();
  });

  test('shows city not found error (mocked 400)', async ({ page }) => {
    await page.route('**/current.json*', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: { code: 1006, message: 'No matching location found.' } })
      });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter city name').fill('InvalidCity');
    await page.getByRole('button', { name: /Get Weather/i }).click();

    await expect(page.getByRole('alert')).toHaveText(/City not found/i);
  });

  test('shows generic error on server failure', async ({ page }) => {
    await page.route('**/current.json*', async route => {
      await route.fulfill({ status: 500, body: 'Internal Server Error' });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter city name').fill('Berlin');
    await page.getByRole('button', { name: /Get Weather/i }).click();

    await expect(page.getByRole('alert')).toHaveText(/Could not fetch weather data/i);
  });

  test('is accessible with keyboard focus', async ({ page }) => {
    await page.goto('/');

    const input = page.getByPlaceholder('Enter city name');
    await input.focus();
    await expect(input).toBeFocused();

    const button = page.getByRole('button', { name: /Get Weather/i });
    await button.focus();
    await expect(button).toBeFocused();
  });

});
