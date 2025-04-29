<script lang="ts">
  export let label: string;
  export let onClick: () => void;
</script>

<button on:click={onClick} class="px-4 py-2 bg-blue-600 text-white rounded">
  {label}
</button>
