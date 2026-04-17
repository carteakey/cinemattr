import { beforeEach, describe, expect, it, vi } from 'vitest';

const jsonMock = vi.fn((body, init) => ({ body, init }));

vi.mock('$env/dynamic/private', () => ({
	env: {
		SEARCH_API_URL: 'https://search.example.com',
		SEARCH_API_MAX_RETRIES: '0',
		SEARCH_API_RETRY_DELAY_MS: '0',
		SEARCH_API_TIMEOUT_MS: '12000'
	}
}));

vi.mock('@sveltejs/kit', () => ({
	json: (body: unknown, init?: ResponseInit) => jsonMock(body, init)
}));

describe('getResults POST', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.clearAllMocks();
	});

	it('returns validation error for short queries', async () => {
		const { POST } = await import('./+server');
		const request = {
			json: async () => ({ query: 'a' })
		};

		await POST({ request } as any);

		expect(jsonMock).toHaveBeenCalledWith(
			{
				error: {
					message: 'Please enter at least 2 characters.',
					status: 422
				}
			},
			{ status: 422 }
		);
	});

	it('proxies successful responses', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: true,
			status: 200,
			json: async () => ({ titles: ['tt1234567'] })
		}) as any;

		const { POST } = await import('./+server');
		const request = {
			json: async () => ({ query: 'dream heist thriller' })
		};

		await POST({ request } as any);

		expect(global.fetch).toHaveBeenCalledTimes(1);
		expect(jsonMock).toHaveBeenCalledWith({ titles: ['tt1234567'] }, undefined);
	});

	it('maps upstream errors to consistent payload', async () => {
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 502,
			statusText: 'Bad Gateway',
			json: async () => ({
				error: {
					message: 'Upstream is down'
				}
			})
		}) as any;

		const { POST } = await import('./+server');
		const request = {
			json: async () => ({ query: 'science fiction with time loops' })
		};

		await POST({ request } as any);

		expect(jsonMock).toHaveBeenCalledWith(
			{
				error: {
					message: 'Upstream is down',
					status: 502
				}
			},
			{ status: 502 }
		);
	});
});
