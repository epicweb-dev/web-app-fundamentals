import { test, expect } from './test'

test('page loads font', async ({ page }) => {
	await Promise.all([
		page.goto('/'),
		page.waitForRequest('/fonts/nunito-sans/font.css'),
	])
	await expect(
		page.getByRole('heading', { level: 1, name: /outer space/i }),
	).toHaveText(/outer space/i)
})
