<script lang="ts">
	import { onMount } from "svelte";
	import {page} from "$app/stores";

	const params = $page.url.searchParams;

	console.log("hi", params.get("v"), params.get("t"));

	/**
	Calls /api/getdatetimejson.ts.
	Based on https://stackoverflow.com/a/15785110/10873246.
	**/
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
			// I've never tested this part.
			console.error("Error thrown, falling back to system time.", error);
			return new Date();
		}
	}

	export let player: YT.Player;
	const ytPlayerId = "youtube-player"
	export let prepareButton: HTMLButtonElement;
	export let countdownElement: HTMLParagraphElement;

	/** What video to play, Rick Astley - Never Gonna Give You Up if unspecified. */
	const initialVideoId = params.get("v") || "dQw4w9WgXcQ";
	/** When to start the video, 8 seconds after system time if unspecified.*/
	const startTime = Number(params.get("t")) || new Date().getTime() + 8000;

	if (initialVideoId.length > 11) {
		throw new Error("YouTube video IDs shouldn't be that long!")
	}

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

		function onPlayerReady(event: YT.PlayerEvent) {

			getSyncedServerTime().then(syncedServerTime => {
				console.log("syncedServerTime", syncedServerTime);

				const now = new Date().getTime();
				let timeToWait = startTime - syncedServerTime.getTime();
				prepareButton.removeAttribute("hidden");

				/** The actual timer until the video plays. */
				setTimeout(() => {
					event.target.playVideo();
					event.target.unMute();
					event.target.g.style.display = "block";
					event.target.g.style["z-index"] = "3";
				}, timeToWait);

				/** For the visible countdown on the page. */
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


	export let thanks: HTMLParagraphElement;
	/** Called on user interaction to allow autoplay (and buffers a bit of the video, maybe). */
	function prepare() {
		player.playVideo();
		player.mute();
		setTimeout(() => {
			player.seekTo(0, false);
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
		align-items: center;
		justify-content: center;
		flex-direction: column;
		color: white;
		z-index: 2;
		margin: auto;
	}

	#countdown {
		font-size: 4em;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: monospace;
	}

	button {
		width: 16ch;
		padding: 1em;
	}
</style>

<div id="cover-div">
	<p id="countdown" bind:this={countdownElement}></p>
	<button bind:this={prepareButton} on:click={() => prepare()} hidden>please press me</button>
	<p bind:this={thanks} hidden>thank you!</p>
</div>



<div id={ytPlayerId}></div>
