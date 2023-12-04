<script lang="ts">
	import {page} from "$app/stores";
	import {DateInput} from "date-picker-svelte";
	import QRCode from "qrcode-svg";

	const base = $page.url.host;
	console.debug(base);

	export let link = " ";
	export let svg = "";

	export let id = "dQw4w9WgXcQ";
	export let datetime = new Date();

	// You might have to change this to http:// in your browser in a local environment.
	$: link = `https://${base}/watch?v=${id}&t=${datetime.getTime()}`;
	$: svg = new QRCode(link).svg();
</script>

<style>
* {
	margin: 0;
}
body {
	max-width: 96ch;
	margin: 2em auto;
}

body > * + * {
	margin-top: 1em;
}

:global(input) {
	border: 1px solid #000a !important;
	border-radius: 1px !important;
	padding: 0.125em 0.25em !important;
}
:global(label) {
	display: block;
}

:global(label > *) {
	display: inline;
}
</style>

<body>
	<header>
		<h1>simulvid</h1>
		<p>a project by 12beesinatrenchcoat for a hackathon / <a href="https://github.com/12beesinatrenchcoat/simulvid">source code</a></p>
	</header>
	<form>
		<h2>settings</h2>
		<label>
			youtube video id
			<input type="text" name="id" bind:value={id} id="" maxlength="11">
		</label>

		<!-- svelte-ignore a11y-label-has-associated-control -->
		<label>
			date
			<DateInput bind:value={datetime}/>
		</label>
	</form>

	<div>
		<h2>output</h2>
		<p>
			link: <a href="{link}">{link}</a>
		</p>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html svg}
	</div>

	<div>
		<h2>debug</h2>
		{id} {datetime}
	</div>
</body>
