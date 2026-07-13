import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch }) => {
	let titleId: unknown;
	try {
		({ title_id: titleId } = await request.json());
	} catch {
		return json({ error: { message: 'Invalid request payload.', status: 400 } }, { status: 400 });
	}
	if (typeof titleId !== 'string' || !/^tt\d{7,10}$/.test(titleId)) {
		return json({ error: { message: 'Invalid IMDb title ID.', status: 422 } }, { status: 422 });
	}

	const apiKey = env.OMDB_API_KEY?.trim();
	if (apiKey) {
		try {
			const url = new URL('https://www.omdbapi.com/');
			url.search = new URLSearchParams({ apikey: apiKey, i: titleId, plot: 'short' }).toString();
			const response = await fetch(url, { signal: AbortSignal.timeout(8_000) });
			const details = await response.json();
			if (response.ok && details.Response !== 'False') return json(details);
		} catch (error) {
			console.warn('OMDb request failed; using Cinemattr metadata fallback.', error);
		}
	}

	const base = env.SEARCH_API_URL?.trim();
	if (!base) {
		return json(
			{ error: { message: 'Movie details are unavailable.', status: 503 } },
			{ status: 503 }
		);
	}

	try {
		const response = await fetch(`${base.replace(/\/$/, '')}/movies/${titleId}`, {
			signal: AbortSignal.timeout(8_000)
		});
		const details = await response.json().catch(() => null);
		if (!response.ok) {
			return json(
				{
					error: {
						message: details?.detail ?? 'Movie details unavailable.',
						status: response.status
					}
				},
				{ status: response.status }
			);
		}
		return json(details);
	} catch (error) {
		console.error('Cinemattr movie details request failed', error);
		return json(
			{ error: { message: 'Movie details are unavailable.', status: 502 } },
			{ status: 502 }
		);
	}
};
