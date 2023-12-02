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
	export let countdownElement: HTMLParagraphElement;
	export let initialVideoId = params.get("v") || "dQw4w9WgXcQ";
	const startTime = Number(params.get("t")) || new Date().getTime() + 8000;

	const ytPlayerId = "youtube-player"

	onMount(() => {
		function load() {
			player = new YT.Player(ytPlayerId, {
				height: "100%",
				width: "100%",
				videoId: initialVideoId,
				playerVars: { autoplay: 1 },
				events: {
					"onReady": onPlayerReady,
				}
			});
		}

		function onPlayerReady(event) {

			getSyncedServerTime().then(syncedServerTime => {
				console.log(syncedServerTime);

				const now = new Date().getTime();
				let timeToWait = startTime - syncedServerTime.getTime();
				prepareButton.removeAttribute("hidden");

				setTimeout(() => {
					event.target.playVideo();
					event.target.seekTo(0);
					event.target.unMute();
					event.target.g.style.display = "block";
					event.target.g.style["z-index"] = "3";

					setTimeout(() => {
						event.target.seekTo(2)
					}, 2000)
				}, timeToWait);

				const countdown = setInterval(() => {
					let timeLeft = now + timeToWait - new Date().getTime()

					if (timeLeft <= 0) {
						timeLeft = 0;
						clearInterval(countdown);
					}

					countdownElement.textContent = (timeLeft / 1000).toFixed(2);

				}, 10)
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
		player.playVideo();
		player.mute();
		setTimeout(() => {
			player.pauseVideo();
		}, 1000);
		thanks.removeAttribute("hidden");
	}
</script>

<svelte:head>
	<script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<style>
	#youtube-player, #cover-div {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0; right: 0; top: 0; bottom: 0;
		background: black;
	}

	#cover-div {
		display: flex;
		flex-direction: column;
		color: white;
		z-index: 2
	}

	#countdown {
		font-size: 4em;
		display: flex;
		align-content: center;
		justify-content: center;
		font-family: monospace;
		height: 3em;
	}
</style>

<div id="cover-div">
	<p id="countdown" bind:this={countdownElement}></p>
	<button bind:this={prepareButton} on:click={() => prepare()} hidden>button</button>
	<p bind:this={thanks} hidden>thank you!</p>
</div>



<div id={ytPlayerId}></div>
