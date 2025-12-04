<script lang="ts">
	import type { Snippet } from 'svelte';
	import '../app.css';
	import YouTubeBackground from '$lib/components/YouTubeBackground.svelte';

	interface Props {
		children?: Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<meta name="color-scheme" content="light dark" />
	<meta name="theme-color" content="rgb(185 28 28)" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="rgb(185 28 28)" media="(prefers-color-scheme: dark)" />
</svelte:head>

<YouTubeBackground videoId="https://www.youtube.com/watch?v=mdnF9R-Bzpg&list=RDmdnF9R-Bzpg&start_radio=1" startTime={5} opacity={0.2} />

{@render children?.()}
