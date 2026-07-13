import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
	const providers = [
		{
			name: 'local',
			baseUrl: env.LOCAL_LLM_BASE_URL?.replace(/\/$/, ''),
			apiKey: env.LOCAL_LLM_API_KEY?.trim() || 'local',
			model: env.LOCAL_LLM_MODEL,
			timeout: Number(env.LOCAL_LLM_TIMEOUT_MS) || 45_000
		},
		{
			name: 'cloud',
			baseUrl: (env.LLM_BASE_URL ?? 'https://api.openai.com/v1').replace(/\/$/, ''),
			apiKey: (env.LLM_API_KEY ?? env.OPENAI_API_KEY)?.trim(),
			model: env.LLM_MODEL ?? 'gpt-4.1-mini',
			timeout: 15_000
		}
	].filter((provider) => provider.baseUrl && provider.apiKey && provider.model);

	if (!providers.length) {
		return json(
			{ error: { message: 'Prompt generation is unavailable.', status: 503 } },
			{ status: 503 }
		);
	}

	for (const provider of providers) {
		try {
			const response = await fetch(`${provider.baseUrl}/chat/completions`, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					authorization: `Bearer ${provider.apiKey}`
				},
				body: JSON.stringify({
					model: provider.model,
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
				signal: AbortSignal.timeout(provider.timeout)
			});
			if (!response.ok || !response.body) {
				console.warn(`${provider.name} prompt provider returned ${response.status}`);
				continue;
			}
			return new Response(response.body, {
				headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-cache' }
			});
		} catch (error) {
			console.warn(`${provider.name} prompt provider unavailable`, error);
		}
	}

	return json(
		{ error: { message: 'Prompt generation is unavailable.', status: 502 } },
		{ status: 502 }
	);
};
