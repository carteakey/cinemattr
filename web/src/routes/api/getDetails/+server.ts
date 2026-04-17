import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function POST({ request }: { request: any }) {
	const omdbApiKey = env.OMDB_API_KEY;
	if (!omdbApiKey) {
		return json(
			{
				error: {
					message: 'OMDB_API_KEY env variable not set',
					status: 500
				}
			},
			{ status: 500 }
		);
	}

	const { title_id } = await request.json();
	const url = `http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${title_id}`;

	const res = await fetch(url);
	const details = await res.json();
	return json(details);
}
