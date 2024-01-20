export const faqs = [
	{
		question: 'What does the app do?',
		answer: `
        It finds movies!
        Just enter any details e.g. plot, actors, directors, year and it will show the most similar results.

        A few examples:
        - Movie where people get stuck in alternate realities.
        - A thriller movie from the year 2019 with a plot revolving around a bank heist.
        `
	},
	{
		question: 'How does it work?',
		answer: `
    - Self querying retriever using <b class='text-white'>LangChain</b>, on a <b class='text-white'>Pinecone</b> database containing popular movies released since 1950.
    - Movie plots collected scraping Wikipedia plot sections and IMDb synopses.
    - OpenAI LLM translates user input to a vector database query.
    - Initial filtering is done through metadata columns (title, year, rating, actors etc.) using operators like > < = AND OR.
    - Semantic search is done on the plot and summaries extracted for each movie.
    - API hosted on <b class='text-white'>AWS Lambda</b>.
    - Frontend hosted on <b class='text-white'>Vercel</b> and built using <b class='text-white'>SvelteKit</b>.`
	},
	{
		question: 'Why am I getting errors or no results?',
		answer:
			'Very beta!! - often breaks due to the non-deterministic nature of language models. Or I am out of money and have hit my hard API limit on OpenAPI.'
	},
	{
		question: `Why can't I use ChatGPT directly?`,
		answer:
			'You can! - however GPT Models have a knowledge cutoff, so they will not be aware of any movies released after 2021. This app shows an example of how to plug-in new data to a Language model for question answering.'
	}
];
