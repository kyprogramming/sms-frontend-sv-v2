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

	// Define the structure of our fee groups object
	type FeeGroups = Record<string, FeeGroup>;

	// Initialize with the correct type
	let feeGroups: FeeGroups = groupByFeeGroup(page.data.feeMasters?.data || []);
	let feeDiscounts: any = page.data.feeDiscounts?.data;
    console.log("Client Component - feeGroups", feeGroups);
    console.log("Client Component - feeDiscounts", feeDiscounts);

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
				selected: false
			});
			return acc;
		}, {} as FeeGroups);
	}

	// Helper function to group fees by their group
	// function groupByFeeGroup(data: any[]) {
	// 	return data.reduce((acc, item) => {
	// 		const groupId = item.feeGroupId._id;

	// 		if (!acc[groupId]) {
	// 			acc[groupId] = {
	// 				id: groupId,
	// 				groupName: item.feeGroupId.name,
	// 				selected: false,
	// 				expanded: false,
	// 				fees: [],
	// 			};
	// 		}

	// 		acc[groupId].fees.push({
	// 			...item,
	// 			selected: false // Add selected property to each fee
	// 		});
	// 		return acc;
	// 	}, {} as Record<string, any>);
	// }

	// Toggle group expansion
	function toggleGroupExpand(groupId: string) {
		feeGroups = {
			...feeGroups,
			[groupId]: {
				...feeGroups[groupId],
				expanded: !feeGroups[groupId].expanded
			}
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
				fees: feeGroups[groupId].fees.map(fee => ({
					...fee,
					selected: newSelected
				}))
			}
		};
	}

	// Toggle individual fee selection
	function toggleFeeSelect(groupId: string, feeId: string) {
		const updatedFees = feeGroups[groupId].fees.map(fee => 
			fee._id === feeId ? { ...fee, selected: !fee.selected } : fee
		);
		
		const anySelected = updatedFees.some(fee => fee.selected);
		
		feeGroups = {
			...feeGroups,
			[groupId]: {
				...feeGroups[groupId],
				fees: updatedFees,
				selected: anySelected
			}
		};
	}

	// Calculate total for a group
	function calculateGroupTotal(group: any) {
		return group.fees.reduce((total: number, fee: any) => 
			fee.selected ? total + fee.amount : total, 0);
	}

	// Calculate overall total
	function calculateTotalPrice() {
		return Object.values(feeGroups).reduce((total: number, group: any) => 
			group.selected ? total + calculateGroupTotal(group) : total, 0);
	}

	// Format date
	function formatDate(dateString: string) {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { 
			year: 'numeric', 
			month: 'short', 
			day: 'numeric' 
		});
	}
</script>

<div class="fee-container">
    
	<div class="total-box">
		<div class="total-label">Total Amount</div>
		<div class="total-amount">{calculateTotalPrice().toFixed(2)}</div>
	</div>

	{#each Object.entries(feeGroups) as [id, group](id)}
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
								<tr class="{fee.selected ? 'selected' : ''}">
									<td>
										<div class="fee-type-name">
											<!-- <input
												type="checkbox"
												class="checkbox"
												checked={fee.selected}
												on:click|stopPropagation={() => toggleFeeSelect(id, fee._id)} /> -->
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

</div>

<style>
	.fee-container {
		width: 100%;
		max-width: 100%;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.fee-group {
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
</style>