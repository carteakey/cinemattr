import { env } from '$env/dynamic/private';
import { json } from '@sveltejs/kit';

function parseIntEnv(rawValue: string | undefined, fallback: number, min = 0) {
	const parsed = Number.parseInt(rawValue ?? '', 10);
	if (!Number.isFinite(parsed) || parsed < min) {
		return fallback;
	}
	return parsed;
}

const MAX_RETRIES = parseIntEnv(env.SEARCH_API_MAX_RETRIES, 3, 0);
const RETRY_DELAY_MS = parseIntEnv(env.SEARCH_API_RETRY_DELAY_MS, 1000, 0);
const REQUEST_TIMEOUT_MS = parseIntEnv(env.SEARCH_API_TIMEOUT_MS, 12000, 1000);

type UpstreamError = {
	error?: {
		message?: string;
		status?: number;
	};
	message?: string;
};

function getSearchApiUrl() {
	const baseUrl = env.SEARCH_API_URL?.trim();
	if (!baseUrl) {
		throw new Error('SEARCH_API_URL env variable not set');
	}

	return `${baseUrl.replace(/\/$/, '')}/search`;
}

async function parseErrorPayload(response: Response): Promise<string> {
	try {
		const payload = (await response.json()) as UpstreamError;
		if (payload.error?.message) {
			return payload.error.message;
		}
		if (payload.message) {
			return payload.message;
		}
	} catch {
		// ignore JSON parsing and fallback to status text
	}

	return response.statusText || 'Request to search API failed';
}

async function fetchWithRetries(url: string, options: RequestInit, retries: number): Promise<Response> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

	try {
		const response = await fetch(url, { ...options, signal: controller.signal });
		if ((response.status >= 500 || response.status === 429) && retries > 0) {
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
			return fetchWithRetries(url, options, retries - 1);
		}
		return response;
	} catch (error) {
		if (retries > 0) {
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
			return fetchWithRetries(url, options, retries - 1);
		}
		throw error;
	} finally {
		clearTimeout(timeout);
	}
}

export async function POST({ request }: { request: any }) {
	const { query } = await request.json();
	if (typeof query !== 'string' || query.trim().length < 2) {
		return json(
			{
				error: {
					message: 'Please enter at least 2 characters.',
					status: 422
				}
			},
			{ status: 422 }
		);
	}

	try {
		const response = await fetchWithRetries(
			getSearchApiUrl(),
			{
				method: 'POST',
				headers: {
					'content-type': 'application/json'
				},
				body: JSON.stringify({ query: query.trim() })
			},
			MAX_RETRIES
		);
		if (!response.ok) {
			const message = await parseErrorPayload(response);
			return json(
				{
					error: {
						message,
						status: response.status
					}
				},
				{ status: response.status }
			);
		}

		const payload = await response.json();
		return json(payload);
	} catch (error) {
		console.error('Error occurred during request:', error);
		return json(
			{
				error: {
					message: 'Unable to reach search API. Please retry in a moment.',
					status: 502
				}
			},
			{ status: 502 }
		);
	}
}
