<script lang="ts">
    import AdminHeader from "$lib/components/layouts/AdminHeader.svelte";
    import Sidebar from "$lib/components/Sidebar.svelte";
 export let data;
</script>
<AdminHeader user={data.user}/>
<Sidebar/>
<slot/>

