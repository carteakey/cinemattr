export const faqs = [
	{
		question: 'What does the app do?',
		answer: `
        Finds movies using natural language descriptions.
        Describe a plot, mood, genre, year — anything. It returns the closest matches.

        A few examples:
        - Movie where people get stuck in alternate realities.
        - A thriller from 2019 about a bank heist.
        - Feel-good animated film for adults, after 2015.
        `
	},
	{
		question: 'How does it work?',
		answer: `
    - An <b class='text-white'>OpenAI-compatible LLM</b> parses your query into structured filters (year, genre, rating) and a semantic query.
    - The semantic query is embedded and matched against a <b class='text-white'>DuckDB VSS</b> vector index using HNSW cosine similarity.
    - Metadata filters (year range, genres, min rating) are applied in the same SQL query.
    - Movie plots were collected by scraping Wikipedia plot sections and IMDb synopses.
    - Backend is a standalone <b class='text-white'>FastAPI</b> service — no LangChain, no Pinecone, no AWS Lambda.
    - Frontend built with <b class='text-white'>SvelteKit</b> and hosted on <b class='text-white'>Vercel</b>.`
	},
	{
		question: 'Why am I getting errors or no results?',
		answer:
			'The app is in beta. If search returns nothing, the query may be too narrow — try broadening it. Errors usually mean the backend is cold-starting (scale-to-zero hosting) or an API limit was hit.'
	},
	{
		question: `Why can't I just use ChatGPT directly?`,
		answer:
			"You can — but LLMs have a knowledge cutoff and don't have structured movie metadata. This app searches a curated corpus of movies released since 1950, with plot embeddings built specifically for semantic similarity."
	},
	{
		question: 'Which LLM / embedding provider does it use?',
		answer:
			"Any OpenAI-compatible provider. The backend is configured via environment variables (<b class='text-white'>LLM_BASE_URL</b>, <b class='text-white'>LLM_MODEL</b>, etc.) — OpenAI, Gemini, and local models all work."
	}
];
