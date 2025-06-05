<script lang="ts">
    import { env } from "$env/dynamic/public";
    const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";
</script>

<svelte:head>
  <title>{schoolName} - Dashboard</title>
</svelte:head>


<div class="container">
    <h1>Admin Dashboard</h1>
</div>