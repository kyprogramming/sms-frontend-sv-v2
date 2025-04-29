<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import Header from "$lib/components/layouts/Header.svelte";
  import Footer from "$lib/components/layouts/Footer.svelte";
</script>

<!-- {#if $page.url.pathname === '/'} -->
<Header />
<!-- {/if} -->

<slot />
