<script>
	import StatsCard from "$lib/components/StatsCard.svelte";

	export let totalClasses;
	export let totalLevels;
	export let totalAcademicYears;
</script>

<div class="stats">
	<StatsCard
		className="blue"
		title="Classes"
		value={totalClasses}
		change={95}
	/>
	<StatsCard 	className="green" title="Levels" value={totalLevels} change={-12} />
	<StatsCard className="purple"
		title="Academic Years"
		value={totalAcademicYears}
		change={-12}
	/>
</div>

<style>
	.stats {
		display: flex;
		gap: 2rem;
		margin: 1rem 0;
		width: 100%;
		font-size: 20px;
	}

	
</style>
