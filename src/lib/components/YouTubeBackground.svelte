<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		videoId: string;
		opacity?: number;
		startTime?: number;
	}

	let { videoId, opacity = 0.2, startTime = 0 }: Props = $props();

	let iframe: HTMLIFrameElement;
	let player: any = null;

	// Extract video ID from URL if full URL is provided
	function extractVideoId(urlOrId: string): string {
		const urlMatch = urlOrId.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
		return urlMatch ? urlMatch[1] : urlOrId;
	}

	const cleanVideoId = $derived(extractVideoId(videoId));
	const embedUrl = $derived(
		`https://www.youtube.com/embed/${cleanVideoId}?autoplay=1&mute=1&loop=1&playlist=${cleanVideoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playsinline=1&enablejsapi=1&start=${startTime}&vq=hd1080`
	);

	onMount(() => {
		// Load YouTube iframe API
		if (typeof window !== 'undefined' && !window.YT) {
			const tag = document.createElement('script');
			tag.src = 'https://www.youtube.com/iframe_api';
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

			// Initialize player when API is ready
			window.onYouTubeIframeAPIReady = () => {
				if (iframe) {
					player = new window.YT.Player(iframe, {
						events: {
							onReady: (event: any) => {
								// Force 1080p quality
								event.target.setPlaybackQuality('hd1080');
								// Seek to start time
								if (startTime > 0) {
									event.target.seekTo(startTime, true);
								}
							}
						}
					});
				}
			};
		} else if (window.YT && iframe) {
			// API already loaded
			player = new window.YT.Player(iframe, {
				events: {
					onReady: (event: any) => {
						event.target.setPlaybackQuality('hd1080');
						// Seek to start time
						if (startTime > 0) {
							event.target.seekTo(startTime, true);
						}
					}
				}
			});
		}
	});
</script>

<div class="youtube-background">
	<div class="youtube-embed" style="opacity: {opacity};">
		<iframe
			bind:this={iframe}
			width="100%"
			height="100%"
			src={embedUrl}
			title="Background video"
			allow="autoplay; encrypted-media"
			allowfullscreen
			frameborder="0"
			loading="lazy"
			id="youtube-background-player"
		/>
	</div>
</div>

<style>
	.youtube-background {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
		overflow: hidden;
		pointer-events: none;
	}

	.youtube-embed {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100vw;
		height: 100vh;
		transform: translate(-50%, -50%);
		min-width: 100%;
		min-height: 100%;
	}

	.youtube-embed iframe {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 100vw;
		height: 100vh;
		transform: translate(-50%, -50%);
		/* Scale to cover entire viewport */
		min-width: 177.77vh; /* 16:9 aspect ratio */
		min-height: 56.25vw;
	}
</style>

