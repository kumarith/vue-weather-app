import { test, expect } from '@playwright/test';


test('Weather App basic UI and fetch', async({page}) => {
    await page.goto('/');

    await expect(page.getByText('Vue Weather App')).toBeVisible();

    await page.getByPlaceholder('Enter city name').fill('London');
    await page.getByRole('button',{name : 'Get Weather'}).click();

    await expect(page.getByText(/London/i)).toBeVisible();

});

test('Weather App fetched with mocked API', async({page}) => {
    await page.route('**/current.json', async route => {
        await route.fulfill({
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
    await expect(page.getByText(/°C/i)).toBeVisible();
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

test('Weather App accessibility', async({page}) => {
    await page.goto('/');

    // Check if the input field is focusable
    const input = page.getByPlaceholder('Enter city name');
    await input.focus();
    await expect(input).toBeFocused();

    // Check if the button is focusable
    const button = page.getByRole('button',{name : 'Get Weather'});
    await button.focus();
    await expect(button).toBeFocused();

    // Check for ARIA roles
    await expect(page.getByRole('heading', { name: 'Vue Weather App' })).toBeVisible();
});

test('Weather App invalid city handling', async({page}) => {
    await page.route('**/current.json', async route => {
        await route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({
                error: {
                    code: 1006,
                    message: 'No matching location found.'
                }
            })
        });
    });

    await page.goto('/');
    await page.getByPlaceholder('Enter city name').fill('InvalidCityName');
    await page.getByRole('button',{name : 'Get Weather'}).click();

    await expect(page.getByText('Could not fetch weather data. Please try again.')).toBeVisible();
});









