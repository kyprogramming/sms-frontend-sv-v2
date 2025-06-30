<script lang="ts">
	import { formatDate } from '$lib/utils/formatDate';

	export let assignments: any[] = [];

	console.log('FeeTable - assignments:', assignments);

	// function formatDate(dateStr: string): string {
	//   const d = new Date(dateStr);
	//   return d.toLocaleDateString('en-GB'); // dd/mm/yyyy
	// }

	function formatAmount(amount: number): string {
		return amount.toFixed(2);
	}

	function calculateFine(a: any): number {
		console.log();
		if (!a.dueDate || a.fineType === 'None' || !a.fineValue) return 0;

		const due = new Date(a.dueDate);
		const today = new Date();
		const daysLate = Math.max(0, Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24)));

		if (daysLate <= 0) return 0;

		if (a.fineType === 'Percentage') {
			const dailyRate = a.perDay ? daysLate : 1;
			return (a.amount * a.fineValue * dailyRate) / 100;
		}

		if (a.fineType === 'Fix') {
			return a.fineValue * (a.perDay ? daysLate : 1);
		}

		return 0;
	}
</script>

<div class="table">
	<div class="table-header">
		<div>Fees</div>
		<div>Status</div>
		<div>Due Date</div>
		<div>Amount</div>
		<div>Discount</div>
		<div>Fine</div>
		<div>Payment ID</div>
		<div>Mode</div>
		<div>Paid Date</div>
		<div>Paid</div>
		<div>Balance</div>
	</div>

	{#each assignments as a}
		<div class="table-row">
			<div>{a.feeMasterId.feeGroupId.name} - {a.feeMasterId.feeTypeId.name}</div>
			<div><span class="unpaid">Unpaid</span></div>
			<div>{formatDate(a.dueDate)}</div>
			<div>
				{formatAmount(a.feeMasterId.amount)}
				{#if calculateFine(a.feeMasterId) > 0}
					<span class="highlight"> + {formatAmount(calculateFine(a.feeMasterId))}</span>
				{/if}
			</div>
			<div>0.00</div>
			<div>{formatAmount(calculateFine(a.feeMasterId))} ({a.feeMasterId.fineType})</div>
			<div>N/A</div>
			<div>N/A</div>
			<div>N/A</div>
			<div>0.00</div>
			<div>{formatAmount(a.feeMasterId.amount)}</div>
		</div>
	{/each}
</div>

<style>
	.table {
		display: flex;
		flex-direction: column;
		width: 100%;
		font-size: 13px;
	}

	.table-header,
	.table-row {
		display: grid;
		grid-template-columns: 2.8fr 1fr 1.5fr 1.5fr 1fr 1.8fr 1fr 1fr 1fr 1fr 1.5fr;
		border-bottom: 1px solid #ddd;
		border-left: 1px solid #ddd;
		border-right: 1px solid #ddd;
		padding: 8px 12px;
		align-items: center;
	}

	.table-header {
		background-color: #f5f5f5;
		font-weight: bold;
		padding: 12px 12px;
		border-top: 1px solid #ddd;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
	}

	.table-row:nth-child(odd) {
		background-color: #fcfcfc;
	}

	.unpaid {
		background-color: #f9d6d5;
		color: #c82333;
		font-weight: bold;
		padding: 4px 6px;
		border-radius: 4px;
		display: inline-block;
		text-align: center;
	}

	.highlight {
		color: #c82333;
		font-weight: bold;
	}

	/* Mobile: Stack each row */
	@media screen and (max-width: 768px) {
		.table-header {
			display: none;
		}

		.table-row {
			display: flex;
			flex-direction: column;
			border: 1px solid #ddd;
			margin-bottom: 12px;
			padding: 12px;
			min-width: 100%;
		}

		.table-row > div {
			display: flex;
			justify-content: space-between;
			padding: 4px 0;
		}

		.table-row > div::before {
			content: attr(data-label);
			font-weight: 600;
			color: #333;
		}
	}
</style>
