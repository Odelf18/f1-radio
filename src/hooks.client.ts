import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = async function (input) {
	const { message } = input;

	return {
		message: message
	};
};
