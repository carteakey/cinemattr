import { LAMBDA_API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function fetchWithRetries(url: string, retries: number): Promise<Response> {
	const response = await fetch(url);
	console.log(response.status);
	console.log(response.statusText);
	console.log(retries);
	console.log(url);

	if (response.status === 500 && retries > 0) {
		console.log('Retrying...');
		await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
		return fetchWithRetries(url, retries - 1);
	}
	return response;
}

export async function POST({ request }: { request: any }) {
	const { query } = await request.json();
	const queryURL = LAMBDA_API_URL + '?query=' + encodeURIComponent(query);
	console.log(queryURL);

	try {
		const response = await fetchWithRetries(queryURL, MAX_RETRIES);

		if (!response.ok) {
			throw new Error(response.statusText);
		}
		const movies = await response.json();
		return json(movies);
	} catch (error) {
		console.error('Error occurred during request:', error);
	}
}
