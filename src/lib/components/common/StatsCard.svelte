<script lang="ts">
	interface Props {
		title?: string;
		value?: number;
		change?: number; // Percentage
		period?: string;
		className?: string; // Custom class prop
	}

	let {
		title = "Total Users",
		value = 277,
		change = 95,
		period = "Last Month",
		className = ""
	}: Props = $props();
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
