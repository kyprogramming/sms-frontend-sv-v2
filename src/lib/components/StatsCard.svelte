<script>
	export let title = "Total Users";
	export let value = 277;
	export let change = 95; // Percentage
	export let period = "Last Month";
	export let className = ""; // Custom class prop
</script>

<div class={`stats-card ${className}`}>
	<div class="stats-title">{title}</div>
	<div class="stats-value">{value.toLocaleString()}</div>
	<!-- <div class="stats-change {change >= 0 ? 'positive' : 'negative'}">
    <span class="change-icon">{change >= 0 ? '+' : ''}</span>
    <span class="change-value">{Math.abs(change)}%</span>
    <span class="change-label">{period}</span>
  </div> -->
</div>

<style>
</style>
