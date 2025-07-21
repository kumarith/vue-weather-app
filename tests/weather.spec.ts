import { test, expect } from '@playwright/test';


test('Weather App basic UI and fetch', async({page}) => {
    await page.goto('/');

    await expect(page.getByText('Vue Weather App')).toBeVisible();

    await page.getByPlaceholder('Enter city name').fill('London');
    await page.getByRole('button',{name : 'Get Weather'}).click();

    await expect(page.getByText(/London/i)).toBeVisible();

});

test('Weather App fetched with mocked API', async({page}) => {
    await page.route('**/current.json', route => {
        route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                location: {
                    name: 'London',
                    country: 'United Kingdom'
                },
                current: {
                    temp_c: 15,
                    condition: {
                        text: 'Partly cloudy'
                    }
                }
            })
        });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter city name').fill('London');
    await page.getByRole('button',{name : 'Get Weather'}).click();

    await expect(page.getByText(/London/i)).toBeVisible();
    await expect(page.getByText(/15°C/i)).toBeVisible();
    await expect(page.getByText(/Partly cloudy/i)).toBeVisible();

})

test('Weather App error handling', async({page}) => {
    await page.goto('/');

    await page.getByRole('button',{name : 'Get Weather'}).click();

    await expect(page.getByText(/Please enter the city name/i)).toBeVisible();

    await page.getByPlaceholder('Enter city name').fill('InvalidCityName');
    await page.getByRole('button',{name : 'Get Weather'}).click();
    await expect(page.getByText('Could not fetch weather data. Please try again.')).toBeVisible();
});
