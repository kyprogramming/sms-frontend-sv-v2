import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
export default defineConfig({
	plugins: [sveltekit()],
	server: {
		proxy: {
			"/api": {
				target: "https://school-management-api-izm4.onrender.com",
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/api/, "/api"),
			},
		},
	},
});
