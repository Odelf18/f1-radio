<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<header class="sticky top-0 z-20 flex-none bg-red-700 p-4 text-white">
	<nav class="mx-auto flex w-full max-w-2xl items-center justify-between gap-2 sm:gap-4">
		<a
			href={localizeHref('/')}
			class="rounded outline-2 outline-offset-4 outline-white outline-none focus-visible:outline-solid"
			title={m['header.title_home']()}
		>
			<h1 class="font-f1 flex-auto text-2xl sm:text-3xl">F1 Radio Meme</h1>
		</a>
	</nav>
</header>
