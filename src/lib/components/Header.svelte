<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { localizeHref } from '$lib/paraglide/runtime';
</script>

<header class="sticky top-0 z-20 flex-none bg-red-700 py-2 px-4 text-white">
	<nav class="mx-auto flex w-full max-w-7xl items-center">
		<a
			href={localizeHref('/')}
			class="rounded outline-2 outline-offset-4 outline-white outline-none focus-visible:outline-solid"
			title={m['header.title_home']()}
		>
			<h1 class="font-f1 text-xl sm:text-2xl">F1 Radio Meme</h1>
		</a>
	</nav>
</header>
