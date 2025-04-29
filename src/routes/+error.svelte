<script lang="ts">
  import { page } from "$app/stores";
</script>

<div
  class="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900 p-4"
>
  <h1 class="text-6xl font-bold mb-4">Oops!</h1>
  <p class="text-xl mb-6">Something went wrong.</p>

  {#if $page.status === 404}
    <p>The page you're looking for doesn't exist.</p>
  {:else if $page.status >= 500}
    <p>We're experiencing technical difficulties. Please try again later.</p>
  {:else}
    <p>An unexpected error occurred.</p>
  {/if}

  <a
    href="/"
    class="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
  >
    Go Home
  </a>
</div>
