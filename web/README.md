# cinemattr.ca

Natural-language movie search. SvelteKit frontend backed by a FastAPI search API.

No LangChain. No Pinecone. No Lambda.

## How it works

1. User types a query ("mind-bending thriller after 2010").
2. Frontend calls the search API (`SEARCH_API_URL/search`).
3. API parses query into structured filters + semantic query via one LLM call.
4. Semantic query is embedded and matched against a DuckDB VSS HNSW index.
5. Results returned as IMDb title IDs; frontend fetches posters/metadata via OMDb.

## Movie discovery

`/discover` provides a mobile-first card deck for deciding what to watch. Enter a mood,
plot, or genre, then swipe or use the pass/save controls. Saved movies remain in a local
shortlist on that browser. The discovery page uses the same search and OMDb server routes,
so API credentials are never exposed to the client.

## Environment variables

```bash
# Search API endpoint (required)
SEARCH_API_URL=https://your-search-api.example.com

# OpenAI-compatible LLM config (used by /api/getRandomPrompt)
LOCAL_LLM_BASE_URL=http://kpc-cachy.llama-alnair.ts.net:8001/v1
LOCAL_LLM_API_KEY=...
LOCAL_LLM_MODEL=gemma-4-26b-qat-mtp
LOCAL_LLM_TIMEOUT_MS=45000

# Cloud fallback
LLM_BASE_URL=https://api.openai.com/v1
LLM_API_KEY=...
LLM_MODEL=gpt-4.1-mini

# OMDb (movie posters + metadata)
OMDB_API_KEY=...

# Optional retry/timeout tuning
SEARCH_API_MAX_RETRIES=3
SEARCH_API_RETRY_DELAY_MS=1000
SEARCH_API_TIMEOUT_MS=12000
```

Works with any OpenAI-compatible provider for `LLM_*` — OpenAI, Gemini, local models.

## Local development

```bash
npm install
npm run dev
```

## Verification

```bash
npm run check
npm run lint
npm run test:unit -- --run
npm test
npm run build
```

Backend: see [cinemattr-db](https://github.com/carteakey/cinemattr-db).
