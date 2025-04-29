<script>
  import Header from "$lib/components/layouts/Header.svelte";
</script>

<div class="flex flex-col">
  <!-- <Header /> -->
  <div class="flex flex-1">
    <!-- <Sidebar /> -->
    <!-- Main content area -->
    <main class="flex-1 p-6 bg-gray-100">
      <slot />
    </main>
  </div>
  <!-- <Footer /> -->
</div>
