import { expect, test } from '@playwright/test';

const movie = {
	imdbID: 'tt1375666',
	Title: 'Inception',
	Year: '2010',
	Genre: 'Action, Sci-Fi',
	Plot: 'A thief enters dreams to steal and plant ideas.',
	Poster: 'N/A',
	imdbRating: '8.8'
};

test('builds a deck and saves a movie', async ({ page }) => {
	await page.route('**/api/getResults', (route) =>
		route.fulfill({ json: { titles: [movie.imdbID] } })
	);
	await page.route('**/api/getDetails', (route) => route.fulfill({ json: movie }));

	await page.goto('/discover');
	await expect(page.getByRole('heading', { name: 'Inception' })).toBeVisible();
	await page.getByRole('button', { name: 'Save this movie' }).click();
	await expect(page.getByRole('heading', { name: 'Shortlist (1)' })).toBeVisible();
	await expect(page.getByText('Inception')).toBeVisible();
});
