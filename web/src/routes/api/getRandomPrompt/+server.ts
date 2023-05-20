
import type { CreateChatCompletionRequest, ChatCompletionRequestMessage } from 'openai';
import { getTokens } from '$lib/tokenizer';
import { json } from '@sveltejs/kit';
import { OPENAI_API_KEY } from '$env/static/private';

export const GET = async ({ request }) => {
	try {
		if (!OPENAI_API_KEY) {
			throw new Error('OPENAI_API_KEY env variable not set');
		}

		const prompt = `Provide a random searching prompt for a movie searching app which has the following Metadata columns. 
                    title,
                    genre,
                    certificate,
                    year,
                    stars,
                    directors,
                    imdb_ratings
                    plot_point

                    Use a combination of any 2 or 3 of these metadata columns to generate your prompt. 
                    Do not provide anything else but the prompt. 
                    Don't include any quotes or bullets or numbers.
                    Do not use verbs in the prompt.
                    Ensure having random plot points or a random actor in the prompt`;

		let tokenCount = 0;
		tokenCount += getTokens(prompt);
		console.log(tokenCount);

		if (tokenCount >= 4000) {
			throw new Error('Query too large');
		}

        const messages: ChatCompletionRequestMessage[] = [{ role: 'system', content: prompt }];

		const chatRequestOpts: CreateChatCompletionRequest = {
			model: 'gpt-3.5-turbo',
			messages,
			temperature: 0.9,
			stream: true
		};

		const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
			headers: {
				Authorization: `Bearer ${OPENAI_API_KEY}`,
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(chatRequestOpts)
		});

		if (!chatResponse.ok) {
			const err = await chatResponse.json();
			throw new Error(err.error.message);
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