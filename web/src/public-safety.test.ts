import { describe, expect, it } from 'vitest';

const publicFiles = import.meta.glob(
	[
		'./routes/api/getResults/+server.ts',
		'./routes/api/getDetails/+server.ts',
		'./routes/api/getRandomPrompt/+server.ts',
		'../README.md'
	],
	{ query: '?raw', import: 'default', eager: true }
) as Record<string, string>;
const credentialPatterns = [
	/\bsk-[A-Za-z0-9]{20,}\b/,
	/\b(?:nvapi|ghp|github_pat|xox[baprs])-[A-Za-z0-9_-]{16,}\b/,
	/\bAIza[0-9A-Za-z_-]{30,}\b/
];

describe('public source safety', () => {
	it('keeps provider credentials out of public source and docs', () => {
		for (const [relativePath, contents] of Object.entries(publicFiles)) {
			for (const pattern of credentialPatterns) {
				expect(contents, relativePath).not.toMatch(pattern);
			}
		}
	});

	it('keeps server routes on the private environment namespace', () => {
		for (const [relativePath, contents] of Object.entries(publicFiles).filter(([path]) =>
			path.startsWith('./routes/')
		)) {
			expect(contents, relativePath).toContain('$env/dynamic/private');
		}
	});
});
