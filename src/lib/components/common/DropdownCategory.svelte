<script lang="ts">
	export let role: 'student' | 'teacher' | 'staff' | 'parent' = 'student';
	export let selected: string = '';
	export let onChange: (value: string) => void = () => {};

	const categoriesByRole: Record<string, string[]> = {
		student: ['Identity', 'Academic', 'Health', 'Consent', 'Address', 'Other'],
		parent: ['Identity', 'Relationship Proof', 'Address', 'Income', 'Consent', 'Other'],
		teacher: ['Identity', 'Academic Qualification', 'Professional Qualification', 'Employment', 'Bank', 'Health', 'Other'],
		staff: ['Identity', 'Qualification', 'Employment', 'Bank', 'Health', 'Other'],
	};

	$: categories = categoriesByRole[role] ?? [];
</script>

<!-- <label for="categories" class="block text-sm font-medium text-gray-700 mb-1">Document Category</label> -->
<select class="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" bind:value={selected} onchange={(e: any) => onChange(e.target.value)}>
	<option disabled selected value="">Select Category</option>
	{#each categories as category}
		<option value={category}>{category}</option>
	{/each}
</select>
