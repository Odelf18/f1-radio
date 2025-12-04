<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import domtoimage from 'dom-to-image';
	import Button from './Button.svelte';
	import { defaultImageConfig, type ImageFormat } from '$lib/config/image';

	interface Props {
		element: HTMLElement | undefined;
		onCopy: (duration: number) => void;
		onError: (error: unknown, duration: number) => void;
		// Image quality settings
		scale?: number; // Scale factor for higher resolution (default: 3)
		format?: ImageFormat; // Image format: 'png' or 'jpeg' (default: 'png')
		quality?: number; // JPEG quality 0-1 (default: 0.92, only used for JPEG)
	}

	let {
		element,
		onCopy,
		onError,
		scale = defaultImageConfig.scale,
		format = defaultImageConfig.format,
		quality = defaultImageConfig.quality
	}: Props = $props();

	let running = $state<boolean>(false);

	async function getImage(output: HTMLElement): Promise<Blob> {
		const width = output.offsetWidth;
		const height = output.offsetHeight;

		const options: Parameters<typeof domtoimage.toBlob>[1] = {
			width: width * scale,
			height: height * scale,
			style: {
				transform: `scale(${scale})`,
				transformOrigin: 'top left',
				width: `${width}px`,
				height: `${height}px`
			}
		};

		// Add format and quality options for JPEG
		if (format === 'jpeg') {
			options.format = 'jpeg';
			options.quality = Math.max(0, Math.min(1, quality));
		}

		return domtoimage.toBlob(output, options);
	}

	async function execute(): Promise<void> {
		const output = element;
		if (output == null) {
			return;
		}

		const start = performance.now();
		running = true;
		try {
			const imageBlob = await getImage(output);
			const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';

			await navigator.clipboard.write([
				new ClipboardItem({
					[mimeType]: imageBlob
				})
			]);

			onCopy(performance.now() - start);
			running = false;
		} catch (error) {
			onError(error, performance.now() - start);
			running = false;
		}
	}
</script>

<Button type="button" onclick={execute} disabled={running}>
	{#if running}
		<svg
			class="h-4 w-4 animate-spin text-white"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
		>
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			/>
		</svg>
	{/if}
	{#if running}
		{m['copy_button.copying']()}
	{:else}
		{m['copy_button.copy']()}
	{/if}
</Button>
