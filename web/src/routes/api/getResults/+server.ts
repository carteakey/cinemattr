import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

const searchUrl = () => {
	const base = env.SEARCH_API_URL?.trim();
	if (!base) throw new Error('SEARCH_API_URL is not configured');
	return `${base.replace(/\/$/, '')}/search`;
};

export const POST: RequestHandler = async ({ request, fetch }) => {
	let query: unknown;
	try {
		({ query } = await request.json());
	} catch {
		return json({ error: { message: 'Invalid request payload.', status: 400 } }, { status: 400 });
	}

	if (typeof query !== 'string' || query.trim().length < 2) {
		return json(
			{ error: { message: 'Please enter at least 2 characters.', status: 422 } },
			{ status: 422 }
		);
	}

	try {
		const response = await fetch(searchUrl(), {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ query: query.trim() }),
			signal: AbortSignal.timeout(Number(env.SEARCH_API_TIMEOUT_MS) || 60_000)
		});
		const payload = await response.json().catch(() => null);
		if (!response.ok) {
			const message = payload?.error?.message ?? 'Search is temporarily unavailable.';
			return json({ error: { message, status: response.status } }, { status: response.status });
		}
		return json(payload);
	} catch (error) {
		console.error('Search API request failed', error);
		return json(
			{ error: { message: 'Unable to reach search API. Please retry in a moment.', status: 502 } },
			{ status: 502 }
		);
	}
};
