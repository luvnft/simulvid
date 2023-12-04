/*
Called in /src/routes/watch.
Based on https://stackoverflow.com/a/15785110/10873246.
*/

export const config = {
	runtime: 'edge',
};

export default async function handler(request: Request) {
	const urlParams = new URL(request.url).searchParams;
	const query = Object.fromEntries(urlParams);
	const {ct} = query;

	const serverTimestamp: number = new Date().getTime();
	const serverClientRequestDiffTime = serverTimestamp - Number(ct);

	return new Response(
		JSON.stringify({
			diff: serverClientRequestDiffTime,
			serverTimestamp,
		}),
		{
		status: 200,
		headers: {
			'content-type': 'application/json',
		},
	},
	);
  }
