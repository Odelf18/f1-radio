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
		
		// Calculate square dimensions (use the larger dimension)
		const maxDimension = Math.max(width, height);
		const squareSize = maxDimension * scale;

		// Get the background color from the element
		const bgColor = getComputedStyle(output).backgroundColor || '#111827'; // bg-gray-900 default

		// Create a temporary container to wrap the element in a square
		const container = document.createElement('div');
		container.style.width = `${maxDimension}px`;
		container.style.height = `${maxDimension}px`;
		container.style.backgroundColor = bgColor;
		container.style.display = 'flex';
		container.style.alignItems = 'center';
		container.style.justifyContent = 'center';
		container.style.position = 'fixed';
		container.style.left = '-9999px';
		container.style.top = '0';
		container.style.zIndex = '-1';
		container.style.visibility = 'hidden';
		
		// Clone the original element to avoid modifying the DOM
		const clonedOutput = output.cloneNode(true) as HTMLElement;
		// Reset any positioning that might interfere
		clonedOutput.style.position = 'relative';
		clonedOutput.style.margin = '0';
		clonedOutput.style.transform = 'none';
		
		container.appendChild(clonedOutput);
		document.body.appendChild(container);

		// Wait a bit for the DOM to update
		await new Promise((resolve) => setTimeout(resolve, 100));

		const options: Parameters<typeof domtoimage.toBlob>[1] = {
			width: squareSize,
			height: squareSize,
			style: {
				transform: `scale(${scale})`,
				transformOrigin: 'center center',
				width: `${maxDimension}px`,
				height: `${maxDimension}px`
			}
		};

		// Add format and quality options for JPEG
		if (format === 'jpeg') {
			options.format = 'jpeg';
			options.quality = Math.max(0, Math.min(1, quality));
		}

		// Debug: log image generation parameters
		console.log('📸 Image generation parameters:', {
			scale,
			format,
			quality,
			originalSize: `${width}x${height}`,
			squareSize: `${maxDimension}x${maxDimension}`,
			outputSize: `${squareSize}x${squareSize}`,
			bgColor
		});

		try {
			const blob = await domtoimage.toBlob(container, options);
			return blob;
		} finally {
			// Clean up the temporary container
			if (container.parentNode) {
				document.body.removeChild(container);
			}
		}
	}

	let downloading = $state<boolean>(false);

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

	async function download(): Promise<void> {
		const output = element;
		if (output == null) {
			return;
		}

		const start = performance.now();
		downloading = true;
		try {
			const imageBlob = await getImage(output);
			const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
			const extension = format === 'jpeg' ? 'jpg' : 'png';
			
			// Create download link
			const url = URL.createObjectURL(imageBlob);
			const link = document.createElement('a');
			link.href = url;
			link.download = `f1-radio-meme.${extension}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);

			onCopy(performance.now() - start);
			downloading = false;
		} catch (error) {
			onError(error, performance.now() - start);
			downloading = false;
		}
	}
</script>

<div class="flex gap-2">
	<Button type="button" onclick={execute} disabled={running || downloading}>
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

	<Button type="button" onclick={download} disabled={running || downloading}>
		{#if downloading}
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
		{#if downloading}
			{m['copy_button.downloading']()}
		{:else}
			{m['copy_button.download']()}
		{/if}
	</Button>
</div>
