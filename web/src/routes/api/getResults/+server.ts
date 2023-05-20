import { LAMBDA_API_URL } from '$env/static/private';
import { json } from '@sveltejs/kit';

export async function POST({ request }: { request: any }) {
  const { query } = await request.json();
  const queryURL = LAMBDA_API_URL+ '?query=' + encodeURIComponent(query)
  console.log(queryURL)
	const response = await fetch(queryURL);
	const movies = await response.json();
	return json(movies);
}
