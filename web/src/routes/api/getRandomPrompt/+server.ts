import { env } from '$env/dynamic/private';
import type { CreateChatCompletionRequest, ChatCompletionRequestMessage } from 'openai';
import { getTokens } from '$lib/tokenizer';
import { json } from '@sveltejs/kit';

export const GET = async () => {
	try {
		const llmApiKey = env.LLM_API_KEY ?? env.OPENAI_API_KEY;
		const llmBaseUrl = env.LLM_BASE_URL ?? 'https://api.openai.com/v1';
		const llmModel = env.LLM_MODEL ?? 'gpt-4.1-mini';

		if (!llmApiKey && llmBaseUrl.includes('openai.com')) {
			throw new Error('LLM_API_KEY or OPENAI_API_KEY env variable not set');
		}

		const prompt = `Provide a random searching string for a movie searching app which finds a movie based on plot. 
        Do not provide anything else but the prompt. Use very specific and random examples that have real answers. Do not use quotes.`;

		let tokenCount = 0;
		tokenCount += getTokens(prompt);
		// console.log(tokenCount);

		if (tokenCount >= 4000) {
			throw new Error('Query too large');
		}

		const messages: ChatCompletionRequestMessage[] = [{ role: 'system', content: prompt }];

		const chatRequestOpts: CreateChatCompletionRequest = {
			model: llmModel,
			messages,
			temperature: 0.9,
			stream: true
		};

		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};
		if (llmApiKey) {
			headers.Authorization = `Bearer ${llmApiKey}`;
		}

		const chatResponse = await fetch(`${llmBaseUrl.replace(/\/$/, '')}/chat/completions`, {
			headers,
			method: 'POST',
			body: JSON.stringify(chatRequestOpts)
		});

		if (!chatResponse.ok) {
			try {
				const err = await chatResponse.json();
				throw new Error(err?.error?.message ?? chatResponse.statusText);
			} catch {
				throw new Error(chatResponse.statusText || 'Request failed');
			}
		}

		return new Response(chatResponse.body, {
			headers: {
				'Content-Type': 'text/event-stream'
			}
		});
	} catch (err) {
		console.error(err);
		return json({ error: 'There was an error processing your request' }, { status: 500 });
	}
};
