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
    - An OpenAI-compatible LLM parses your query into structured filters (year, genre, rating) and a semantic query.
    - The semantic query is embedded and matched against a DuckDB VSS vector index using HNSW cosine similarity.
    - Metadata filters (year range, genres, min rating) are applied in the same SQL query.
    - The backend catalog starts with IMDb's official non-commercial metadata, adds OMDb plot text when available, and retains existing Wikipedia plot rows as a fallback. Coverage depends on the current enrichment state.
    - Backend is a standalone FastAPI service — no LangChain, no Pinecone, no AWS Lambda.
    - Frontend built with SvelteKit and hosted on Vercel.`
	},
	{
		question: 'Why am I getting errors or no results?',
		answer:
			'The app is in beta. If search returns nothing, the query may be too narrow — try broadening it. Errors usually mean the backend is cold-starting (scale-to-zero hosting) or an API limit was hit.'
	},
	{
		question: `Why can't I just use ChatGPT directly?`,
		answer:
			"You can — but LLMs have a knowledge cutoff and don't have structured movie metadata. This app searches the current corpus of movies released since 1950, with plot embeddings built specifically for semantic similarity; coverage varies with the latest enrichment run."
	},
	{
		question: 'Which LLM / embedding provider does it use?',
		answer:
			'Any OpenAI-compatible provider. The backend is configured via environment variables (LLM_BASE_URL, LLM_MODEL, etc.) — OpenAI, Gemini, and local models all work.'
	}
];
