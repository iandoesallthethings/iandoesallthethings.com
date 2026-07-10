import { expect, test } from '@playwright/test'

test('homepage shows the project pool', async ({ page }) => {
	await page.goto('/')

	await expect(page).toHaveTitle('Ian Edwards does all the things.')
	await expect(page.locator('.particle').first()).toBeVisible()
})

test('project pages render markdown content', async ({ page }) => {
	await page.goto('/ronome')

	await expect(page.getByRole('heading', { name: /Ronome/ })).toBeVisible()
})

test('attachments are served', async ({ request }) => {
	const response = await request.get('/attachments/santoka.png')

	expect(response.status()).toBe(200)
	expect(response.headers()['content-type']).toBe('image/png')
})

test('contact page renders', async ({ page }) => {
	await page.goto('/contact')

	await expect(page.getByText('ianDoesAllTheThings@gmail.com')).toBeVisible()
})
