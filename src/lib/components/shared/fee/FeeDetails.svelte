<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	let { selectedFeeMasterAssignmentIds = $bindable([]), selectedFeeDiscountIds = $bindable([]) } = $props();

	let discountsExpanded = $state(true);

	// Initialize with the correct type
	let feeGroups: FeeGroups = $state(groupByFeeGroup(page.data.feeMasters?.data || []));
	let feeDiscounts: Discount[] = $state([]);

	onMount(() => {
		feeDiscounts = (page.data.feeDiscounts?.data || []).map((d: any) => ({ ...d, selected: selectedFeeDiscountIds.includes(d._id) }));
	});

	// Replace the toggleGroupExpand call for discounts with this
	function toggleDiscountsExpand() {
		discountsExpanded = !discountsExpanded;
	}

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

			const feeSelected = selectedFeeMasterAssignmentIds.includes(item._id);
			acc[groupId].fees.push({
				...item,
				selected: feeSelected,
			});
			// Mark the group as selected if any fee in it is selected
			if (feeSelected) {
				acc[groupId].selected = true;
			}
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

        selectedFeeMasterAssignmentIds = newSelected
			? [...selectedFeeMasterAssignmentIds, ...feeGroups[groupId].fees.map((fee) => fee._id)]
			: selectedFeeMasterAssignmentIds.filter((id) => !feeGroups[groupId].fees.some((fee) => fee._id === id));

	}

	// Toggle individual fee selection
	function toggleFeeSelect(groupId: string, feeId: string) {
		const updatedFees = feeGroups[groupId].fees.map((fee) => (fee._id === feeId ? { ...fee, selected: !fee.selected } : fee));

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
		feeDiscounts = feeDiscounts.map((discount) => (discount._id === discountId ? { ...discount, selected: !discount.selected } : discount));
		// Update the bound prop
		selectedFeeDiscountIds = feeDiscounts.filter((d) => d.selected).map((d) => d._id);
	}

	// Calculate total for a group
	function calculateGroupTotal(group: any) {
		return group.fees.reduce((total: number, fee: any) => (fee.selected ? total + fee.amount : total), 0);
	}

	// Calculate subtotal (before discounts)
	function calculateSubTotal() {
		return Object.values(feeGroups).reduce((total: number, group: any) => (group.selected ? total + calculateGroupTotal(group) : total), 0);
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
		const discountsWithSelection = feeDiscounts.map((d) => ({
			...d,
			selected: selectedFeeDiscountIds.includes(d._id),
		}));
		return discountsWithSelection.filter((d) => d.selected);
	}
</script>

<div class="fee-container">
	{#each Object.entries(feeGroups) as [id, group] (id)}
		<div class="fee-group {group.selected ? 'selected' : ''} {group.expanded ? 'expanded' : ''}">
			<div class="fee-group-header" role="button" tabindex="0" onclick={() => toggleGroupExpand(id)} onkeydown={(e) => e.key === 'Enter' && toggleGroupExpand(id)}>
				<svg class="expand-icon" width="14" height="14" style="margin-right: 10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>

				<input
					type="checkbox"
					class="checkbox"
					checked={group.selected}
					onclick={(e) => {
						e.stopPropagation();
						toggleGroupSelect(id);
					}}
					onkeydown={(e) => {
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
		<div class="discount-group {discountsExpanded ? 'expanded' : ''}">
			<div class="fee-group-header" role="button" tabindex="0" onclick={toggleDiscountsExpand} onkeydown={(e) => e.key === 'Enter' && toggleDiscountsExpand()}>
				<svg class="expand-icon" width="14" height="14" style="margin-right: 10px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>

				<div class="fee-group-title">Available Discounts</div>

				<div class="fee-group-price">
					{getSelectedDiscounts().length} discount(s) selected
				</div>
			</div>

			{#if discountsExpanded}
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
										<input type="checkbox" checked={discount.selected} onclick={() => toggleDiscountSelect(discount._id)} />
										<span>{discount.name}</span>
									</td>
									<td>{discount.code}</td>
									<td>{discount.discountType}</td>
									<td>
										{discount.discountType === 'fixed' ? `₹${discount.amount.toFixed(2)}` : `${discount.amount}%`}
									</td>
									<td>{discount.applicableTo}</td>
									<td>{formatDate(discount.expiryDate)}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{/if}
		</div>
	{/if}

	<div class="combined-total-box">
		<div class="total-row single-line">
			<div class="left-section">
				<span class="total-label">Subtotal:</span>
				<span class="total-amount">{calculateSubTotal().toFixed(2)}</span>
				<span class="total-label">Discounts:</span>
				<span class="total-amount total-discount">-{calculateTotalDiscount().toFixed(2)}</span>
			</div>

			<div class="right-section">
				<span class="total-label">Total Amount to be paid:</span>
				<span class="total-amount">{calculateTotalPrice().toFixed(2)}</span>
			</div>
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

	.discount-table {
		padding-top: 0.25rem;
	}

	.cell-content {
		display: flex;
		justify-content: start;
		align-items: center;
		gap: 0.5rem;
	}

	.total-label {
		font-weight: 600;
		color: #4a5568;
	}

	.combined-total-box .total-row.single-line {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.left-section,
	.right-section {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-left: 5px;
	}

	.total-label {
		font-weight: bold;
		color: #555555;
	}

	.total-amount {
		color: #2b6cb0;
		font-weight: 600;
		margin-right: 15px;
		font-weight: 700;
		font-size: 1rem;
	}
	.total-discount {
		color: #01ac0f;
	}
</style>
