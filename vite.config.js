import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'; // <-- added import

export default defineConfig({
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			// <-- added PWA plugin
			strategies: 'generateSW', // 'generateSW' or 'injectManifest'
			registerType: 'autoUpdate',
			manifest: {
				name: 'Ticket Booking Chatbot',
				short_name: 'Booking Chatbot',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#317EFB',
				icons: [
					{
						src: '/favicon1.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/favicon.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			}
		})
	],
	server: {
		port: 5173,
		host: '0.0.0.0'
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
