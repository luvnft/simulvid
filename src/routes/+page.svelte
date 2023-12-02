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

	$: link = `https://${base}/watch?v=${id}&t=${datetime.getTime()}`;
	$: svg = new QRCode(link).svg();
</script>

<label>
	youtube video id
	<input type="text" name="id" bind:value={id} id="">

</label>


<DateInput bind:value={datetime}/>


<p></p>

{id} {datetime}
<a href="{link}">{link}</a>
<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html svg}

