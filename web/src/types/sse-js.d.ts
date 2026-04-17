declare module 'sse.js' {
	export class SSE {
		constructor(
			url: string,
			options?: {
				method?: string;
				headers?: Record<string, string>;
				payload?: string;
			}
		);
		addEventListener(type: string, listener: (event: Event | MessageEvent) => void): void;
		close?(): void;
		stream(): void;
	}
}
