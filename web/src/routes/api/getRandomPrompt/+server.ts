import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
	const apiKey = (env.LLM_API_KEY ?? env.OPENAI_API_KEY)?.trim();
	const baseUrl = (env.LLM_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, '');
	if (!apiKey) {
		return json(
			{ error: { message: 'Prompt generation is unavailable.', status: 503 } },
			{ status: 503 }
		);
	}

	try {
		const response = await fetch(`${baseUrl}/chat/completions`, {
			method: 'POST',
			headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
			body: JSON.stringify({
				model: env.LLM_MODEL ?? 'gpt-4.1-mini',
				messages: [
					{
						role: 'system',
						content:
							'Write one specific, concise movie-search prompt based on plot, mood, or scene. Return only the prompt without quotes.'
					}
				],
				temperature: 0.9,
				stream: true
			}),
			signal: AbortSignal.timeout(15_000)
		});
		if (!response.ok || !response.body) {
			return json(
				{ error: { message: 'Prompt generation is unavailable.', status: 502 } },
				{ status: 502 }
			);
		}
		return new Response(response.body, {
			headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' }
		});
	} catch (error) {
		console.error('Prompt generation failed', error);
		return json(
			{ error: { message: 'Prompt generation is unavailable.', status: 502 } },
			{ status: 502 }
		);
	}
};
