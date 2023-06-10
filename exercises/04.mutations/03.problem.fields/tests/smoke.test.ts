import { test, expect } from './test.ts'

test('page loads', async ({ page }) => {
	await page.goto('/')
	await expect(
		page.getByRole('heading', { level: 1, name: /outer space/i }),
	).toHaveText(/outer space/i)
})
