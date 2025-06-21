<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';

	// Group the fee data
	interface FeeType {
		_id: string;
		feeGroupId: {
			_id: string;
			name: string;
		};
		feeTypeId: {
			_id: string;
			name: string;
		};
		amount: number;
		dueDate: string;
		fineType: string;
		selected: boolean;
	}

	interface FeeGroup {
		id: string;
		groupName: string;
		selected: boolean;
		expanded: boolean;
		fees: FeeType[];
	}

	interface Discount {
		_id: string;
		name: string;
		code: string;
		discountType: 'fixed' | 'percentage';
		amount: number;
		applicableTo: string;
		expiryDate: string;
		selected: boolean;
	}

	// Define the structure of our fee groups object
	type FeeGroups = Record<string, FeeGroup>;

	// Initialize with the correct type
	let feeGroups: FeeGroups = groupByFeeGroup(page.data.feeMasters?.data || []);
	let feeDiscounts: Discount[] = (page.data.feeDiscounts?.data || []).map((d:any) => ({
		...d,
		selected: false,
	}));

	console.log('Client Component - feeGroups', feeGroups);
	console.log('Client Component - feeDiscounts', feeDiscounts);

	// Update the groupByFeeGroup function to return properly typed data
	function groupByFeeGroup(data: any[]): FeeGroups {
		return data.reduce((acc: FeeGroups, item: any) => {
			const groupId = item.feeGroupId._id;

			if (!acc[groupId]) {
				acc[groupId] = {
					id: groupId,
					groupName: item.feeGroupId.name,
					selected: false,
					expanded: false,
					fees: [],
				};
			}

			acc[groupId].fees.push({
				...item,
				selected: false,
			});
			return acc;
		}, {} as FeeGroups);
	}

	// Toggle group expansion
	function toggleGroupExpand(groupId: string) {
		feeGroups = {
			...feeGroups,
			[groupId]: {
				...feeGroups[groupId],
				expanded: !feeGroups[groupId].expanded,
			},
		};
	}

	// Toggle group selection (and all its fees)
	function toggleGroupSelect(groupId: string) {
		const newSelected = !feeGroups[groupId].selected;

		feeGroups = {
			...feeGroups,
			[groupId]: {
				...feeGroups[groupId],
				selected: newSelected,
				fees: feeGroups[groupId].fees.map((fee) => ({
					...fee,
					selected: newSelected,
				})),
			},
		};
	}

	// Toggle individual fee selection
	function toggleFeeSelect(groupId: string, feeId: string) {
		const updatedFees = feeGroups[groupId].fees.map((fee) =>
			fee._id === feeId ? { ...fee, selected: !fee.selected } : fee,
		);

		const anySelected = updatedFees.some((fee) => fee.selected);

		feeGroups = {
			...feeGroups,
			[groupId]: {
				...feeGroups[groupId],
				fees: updatedFees,
				selected: anySelected,
			},
		};
	}

	// Toggle discount selection
	function toggleDiscountSelect(discountId: string) {
		feeDiscounts = feeDiscounts.map((discount) =>
			discount._id === discountId ? { ...discount, selected: !discount.selected } : discount,
		);
	}

	// Calculate total for a group
	function calculateGroupTotal(group: any) {
		return group.fees.reduce(
			(total: number, fee: any) => (fee.selected ? total + fee.amount : total),
			0,
		);
	}

	// Calculate subtotal (before discounts)
	function calculateSubTotal() {
		return Object.values(feeGroups).reduce(
			(total: number, group: any) => (group.selected ? total + calculateGroupTotal(group) : total),
			0,
		);
	}

	// Calculate total discount amount
	function calculateTotalDiscount() {
		const subtotal = calculateSubTotal();
		return feeDiscounts.reduce((total, discount) => {
			if (!discount.selected) return total;

			if (discount.discountType === 'fixed') {
				return total + Math.min(discount.amount, subtotal);
			} else {
				// percentage discount
				return total + subtotal * (discount.amount / 100);
			}
		}, 0);
	}

	// Calculate total price after discounts
	function calculateTotalPrice() {
		const subtotal = calculateSubTotal();
		const discount = calculateTotalDiscount();
		return Math.max(0, subtotal - discount);
	}

	// Format date
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	}

	// Get selected discounts
	function getSelectedDiscounts() {
		return feeDiscounts.filter((d) => d.selected);
	}
</script>

<div class="fee-container">
   
	{#each Object.entries(feeGroups) as [id, group] (id)}
		<div class="fee-group {group.selected ? 'selected' : ''} {group.expanded ? 'expanded' : ''}">
			<div
				class="fee-group-header"
				role="button"
				tabindex="0"
				on:click={() => toggleGroupExpand(id)}
				on:keydown={(e) => e.key === 'Enter' && toggleGroupExpand(id)}>
				<svg
					class="expand-icon"
					width="14"
					height="14"
					style="margin-right: 10px;"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>

				<input
					type="checkbox"
					class="checkbox"
					checked={group.selected}
					on:click|stopPropagation={() => toggleGroupSelect(id)}
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.stopPropagation();
							toggleGroupSelect(id);
						}
					}} />

				<div class="fee-group-title">
					{group.groupName}
				</div>

				<div class="fee-group-price">
					{calculateGroupTotal(group).toFixed(2)}
				</div>
			</div>

			{#if group.expanded}
				<div transition:slide>
					<table>
						<thead>
							<tr>
								<th>Fee Type</th>
								<th>Due Date</th>
								<th class="amount-cell">Amount</th>
							</tr>
						</thead>
						<tbody>
							{#each group.fees as fee (fee._id)}
								<tr class={fee.selected ? 'selected' : ''}>
									<td>
										<div class="fee-type-name">
											{fee.feeTypeId.name}
										</div>
									</td>
									<td>
										<div class="meta-icon">
											<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											{formatDate(fee.dueDate)}
										</div>
									</td>
									<td class="amount-cell">
										{fee.amount.toFixed(2)}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/each}

	{#if feeDiscounts.length > 0}
		<div class="discount-group">
			<div
				class="fee-group-header"
				role="button"
				tabindex="0"
				on:click={() => toggleGroupExpand('discounts')}
				on:keydown={(e) => e.key === 'Enter' && toggleGroupExpand('discounts')}>
				<svg
					class="expand-icon"
					width="14"
					height="14"
					style="margin-right: 10px;"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>

				<div class="fee-group-title">Available Discounts</div>

				<div class="fee-group-price">
					{getSelectedDiscounts().length} selected
				</div>
			</div>

			<div class="discount-table" transition:slide>
				<table>
					<thead>
						<tr>
							<th>Discount Name</th>
							<th>Code</th>
							<th>Type</th>
							<th>Amount</th>
							<th>Applicable To</th>
							<th>Expiry Date</th>
						</tr>
					</thead>
					<tbody>
						{#each feeDiscounts as discount (discount._id)}
							<tr class={discount.selected ? 'selected' : ''}>
								<td class="cell-content">
									<input
										type="checkbox"
										checked={discount.selected}
										on:click={() => toggleDiscountSelect(discount._id)} />
									<span>{discount.name}</span>
								</td>
								<td>{discount.code}</td>
								<td>{discount.discountType}</td>
								<td>
									{discount.discountType === 'fixed'
										? `₹${discount.amount.toFixed(2)}`
										: `${discount.amount}%`}
								</td>
								<td>{discount.applicableTo}</td>
								<td>{formatDate(discount.expiryDate)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}

    <div class="combined-total-box">
        <div class="total-row">
            <div class="total-label">Subtotal:</div>
            <div class="total-amount">{calculateSubTotal().toFixed(2)}</div>
        </div>
    
        {#if getSelectedDiscounts().length > 0}
            <div class="total-row discount-row">
                <div class="total-label">Discounts:</div>
                <div class="total-amount">-{calculateTotalDiscount().toFixed(2)}</div>
            </div>
        {/if}
    
        <div class="total-row final-row">
            <div class="total-label">Total Amount to be paid:</div>
            <div class="total-amount">{calculateTotalPrice().toFixed(2)}</div>
        </div>
    </div>

</div>

<style>
	.fee-container {
		width: 100%;
		max-width: 100%;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.fee-group,
	.discount-group {
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		margin-bottom: 0.5rem;
		overflow: hidden;
	}

	.fee-group.selected {
		border-color: #4299e1;
	}

	.fee-group-header {
		display: flex;
		align-items: center;
		padding: 0.75rem 1rem;
		cursor: pointer;
		background: #efeff0;
	}

	.fee-group-title {
		font-weight: 600;
		color: #2d3748;
		flex-grow: 1;
	}

	.fee-group-price {
		font-weight: 600;
		color: #2b6cb0;
		margin: 0 1rem;
	}

	.expand-icon {
		transition: transform 0.2s ease;
		color: #718096;
	}

	.expanded .expand-icon {
		transform: rotate(90deg);
	}

	.checkbox {
		width: 1.1rem;
		height: 1.1rem;
		accent-color: #4299e1;
		margin-right: 0.75rem;
		cursor: pointer;
	}

	table {
		width: 100%;
		border-collapse: collapse;
	}

	th {
		background: transparent;
		padding: 0.5rem 1rem;
		text-align: left;
		font-weight: 500;
		color: #515151;
		font-size: 12px;
		border-bottom: 1px solid #e2e8f0;
	}

	td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid #e2e8f0;
	}

	tr:last-child td {
		border-bottom: none;
	}

	tr.selected {
		background-color: #f0f9ff;
	}

	.fee-type-name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.amount-cell {
		text-align: right;
	}

	.total-box {
		padding: 0.5rem;
		border-radius: 6px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 1rem;
		margin-bottom: 0.5rem;
		background-color: #f8fafc;
	}

	.final-total {
		background-color: #e6f7ff;
		margin-bottom: 1.5rem;
	}

	.discount-total {
		background-color: #ebf8ff;
		border: 1px solid #bee3f8;
	}

	.total-label {
		font-weight: 600;
		color: #4a5568;
	}

	.total-amount {
		font-weight: 700;
		color: #2b6cb0;
		font-size: 1.2rem;
		margin-right: 0.5rem;
	}

	.meta-icon {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		color: #4a5568;
	}

	.icon {
		width: 14px;
		height: 14px;
		opacity: 0.7;
	}

	.discount-group {
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		margin-bottom: 0.5rem;
		overflow: hidden;
	}

	.discount-group.expanded {
		border-color: #4299e1;
	}

	.discount-table {
		padding-top: 0.25rem;
	}

	.cell-content {
		display: flex;
		justify-content: start;
		align-items: center;
		gap: 0.5rem;
	}

    .totals-container {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        margin: 1rem 0 1.5rem 0;
    }

    .total-box {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        border-radius: 6px;
        background-color: #f8fafc;
    }

    .total-label {
        font-weight: 600;
        color: #4a5568;
    }

    .total-amount {
        font-weight: 700;
        color: #2b6cb0;
        font-size: 1.1rem;
    }

    .discount-total {
        background-color: #ebf8ff;
        border: 1px solid #bee3f8;
    }

    .final-total {
        background-color: #e6f7ff;
        border: 1px solid #b3e0ff;
    }

    .combined-total-box {
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.5rem;
        margin: 0.5rem 0;
        background: #f8fafc;
    }

    .total-row {
        display: flex;
        justify-content: space-between;
        padding: 0.25rem 0;
    }

    .discount-row {
        border-top: 1px dashed #cbd5e0;
        border-bottom: 1px dashed #cbd5e0;
        margin: 0.25rem 0;
    }

    .final-row {
        padding-top: 0.75rem;
        font-weight: bold;
    }

    .total-label {
        color: #4a5568;
    }

    .total-amount {
        color: #2b6cb0;
        font-weight: 600;
    }

    .final-row .total-amount {
        font-size: 1.2em;
        color: #2c5282;
    }
</style>
