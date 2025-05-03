<script lang="ts">
    import AdminHeader from "$lib/components/layouts/AdminHeader.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
 export let data;
</script>
<AdminHeader user={data.user}/>
<Sidebar/>
<!-- {#if data.user}
  <div style="padding: 1rem; background: #f0f0f0;">
    Welcome, {data.user.name}!
  </div>
{/if} -->
<slot/>
<!-- {@render children()} -->
