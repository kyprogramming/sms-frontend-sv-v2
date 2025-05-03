import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
  },
  // Add this block to enable proxying
//   vite: {
//     server: {
//       proxy: {
//         "/api": {
//           target: "http://localhost:5000",
//           secure: false,
//           changeOrigin: false,
//         },
//       },
//     },
//   },
};

export default config;
