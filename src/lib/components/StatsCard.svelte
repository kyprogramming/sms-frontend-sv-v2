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
  .stats-card {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: white;
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stats-title {
    color: var(--gray0);
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .stats-value {
   color: var(--gray0);
    font-size: 32px;
    font-weight: 700;
    margin: 4px 0;
  }

  .stats-change {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
  }

  .stats-change.positive {
    color: #10b981;
  }

  .stats-change.negative {
    color: #ef4444;
  }

  .change-icon {
    font-weight: 700;
  }

  .change-value {
    font-weight: 600;
  }

  .change-label {
    color: var(--gray3);
    font-weight: 400;
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
		background: linear-gradient(135deg, #01356d 0%, #00b7eb 100%);
	}
	.green {
		background: linear-gradient(135deg, #025716 0%, #26b863 100%);
	}
	.purple {
		background: linear-gradient(135deg, #4a0366 0%, #e056fd 100%);
	}
</style>