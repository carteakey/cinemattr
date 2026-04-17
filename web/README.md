# cinemattr.ca
Movie searching app built with LangChain, Pinecone and SvelteKit.

Very beta!! - often breaks due to the non-deterministic nature of language models.

The frontend calls a standalone search API (no Lambda dependency), configured via environment variables.

## Environment variables

```bash
# Search API endpoint (required)
SEARCH_API_URL=https://your-search-api.example.com

# Optional retry/timeout tuning
SEARCH_API_MAX_RETRIES=3
SEARCH_API_RETRY_DELAY_MS=1000
SEARCH_API_TIMEOUT_MS=12000

# OpenAI-compatible LLM config for /api/getRandomPrompt
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=...
LLM_MODEL=gpt-4.1-mini
OPENAI_API_KEY=... # legacy fallback

# Existing
OMDB_API_KEY=...
```

## Local development

```bash
npm install
npm run dev
```

see [cinemattr-db](https://github.com/carteakey/cinemattr-db) for data pipeline and backend API details.
