import { json } from '@sveltejs/kit';
import { OMDB_API_KEY } from '$env/static/private';

export async function POST({ request }: { request: any }) {
	const { title_id } = await request.json();
	const url = `http://www.omdbapi.com/?apikey=${OMDB_API_KEY}&i=${title_id}`;

	const res = await fetch(url);
	const details = await res.json();
	return json(details);
}

