<script lang="ts">
	import { onMount } from "svelte";
	import {page} from "$app/stores";

	const params = $page.url.searchParams;

	console.log("hi", params.get("v"), params.get("t"));

	async function getSyncedServerTime(): Promise<Date> {
		const clientTimestamp = new Date().getTime();

		try {
			return await fetch("/api/getdatetimejson?ct=" + clientTimestamp, {
				method: "GET",
			})
				.then((response) => response.json())
				.then((json) => {
					const serverClientRequestDiffTime: number = json.diff;
					const serverTimestamp: number = json.serverTimestamp;
					const nowTimestamp = new Date().getTime();

					const serverClientResponseDiffTime = nowTimestamp - serverTimestamp;
					const responseTime = (serverClientRequestDiffTime - nowTimestamp + clientTimestamp - serverClientRequestDiffTime) / 2

					const syncedServerTime: Date = new Date(nowTimestamp + (serverClientResponseDiffTime - responseTime));

					return syncedServerTime;
				});
		} catch(error) {
			console.error(error);
			return null;
		}
	}

	export let player;
	export let prepareButton: HTMLButtonElement;
	export let initialVideoId = params.get("v") || "dQw4w9WgXcQ";
	const startTime = Number(params.get("t")) || new Date().getTime() + 8000;

	const ytPlayerId = "youtube-player"

	onMount(() => {
		function load() {
			player = new YT.Player(ytPlayerId, {
				height: "100%",
				width: "100%",
				videoId: initialVideoId,
				playerVars: { autoplay: 0 },
				events: {
					"onReady": onPlayerReady,
				}
			});
		}

		function onPlayerReady(event) {
			prepareButton.removeAttribute("hidden");

			getSyncedServerTime().then(syncedServerTime => {
				console.log(syncedServerTime);
				setTimeout(() => {
					event.target.unMute();
					event.target.playVideo();
					event.target.g.style.display = "block";
					setTimeout(() => {
						event.target.seekTo(2)
					}, 2000)
				}, startTime - syncedServerTime.getTime());
			});
		}

		if (window.YT) {
			load();
		} else {
			window.onYouTubeIframeAPIReady = load;
		}
	});


	export let thanks;
	function prepare() {
		player.mute();
		player.playVideo();
		setTimeout(() => {
			player.seekTo(0);
			player.pauseVideo();
		}, 1000);
		thanks.removeAttribute("hidden");
	}
</script>

<svelte:head>
	<script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<style>
	#youtube-player {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0; right: 0; top: 0; bottom: 0;
	}
</style>

<button bind:this={prepareButton} on:click={() => prepare()} hidden>button</button>
<p bind:this={thanks} hidden>thank you!</p>

<div id={ytPlayerId} style="display: none"></div>
