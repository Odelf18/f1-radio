import { browser } from '$app/environment';
import posthog from 'posthog-js';

export function initPosthog() {
	if (!browser) {
		return;
	}

	// Try to get PUBLIC_POSTHOG_KEY, but don't fail if it's not available
	// In SvelteKit, missing env vars cause import errors, so we need to handle this gracefully
	import('$env/static/public')
		.then((env) => {
			const posthogKey = env.PUBLIC_POSTHOG_KEY;
			
			if (!posthogKey) {
				console.warn('PostHog: PUBLIC_POSTHOG_KEY is not set, analytics disabled');
				return;
			}

			posthog.init(posthogKey, {
				api_host: '/relay-ujOT',
				ui_host: 'https://us.posthog.com',
				person_profiles: 'always',
				persistence: 'localStorage'
			});
		})
		.catch(() => {
			// PUBLIC_POSTHOG_KEY is not defined, which is fine for local development
			console.warn('PostHog: PUBLIC_POSTHOG_KEY is not available, analytics disabled');
		});
}
