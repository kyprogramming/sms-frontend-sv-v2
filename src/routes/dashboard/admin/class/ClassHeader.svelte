<script>
	export let totalClasses;
	export let totalLevels;
	export let totalAcademicYears;
</script>

<div class="stats">
	<div class="stat blue">Total Classes<span>{totalClasses}</span></div>
	<div class="stat green">Total Levels <span>{totalLevels}</span></div>
	<div class="stat purple">
		Total Academic Years <span>{totalAcademicYears}</span>
	</div>
</div>

<style>
	.stats {
		display: flex;
		gap: 2rem;
		margin: 1rem 0;
		width: 100%;
        font-size: 20px;
	}

	.stat {
		flex: 1;
		padding: 1.5rem;
		border-radius: 8px;
		gap: 0.5rem;
		color: white;
		font-weight: bold;
		text-align: center;
		height: 90px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		transition: font-size 0.3s ease;
	}

	.stat:hover {
		font-size: 25px;
	}

	/* Combined gradient backgrounds in one line */
	.blue {
		background: linear-gradient(135deg, #007bff 0%, #00b7eb 100%);
	}
	.green {
		background: linear-gradient(135deg, #28a745 0%, #2ecc71 100%);
	}
	.purple {
		background: linear-gradient(135deg, #9b59b6 0%, #e056fd 100%);
	}
</style>
