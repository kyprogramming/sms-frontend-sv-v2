<script lang="ts">
    type FeeType = {
        id: string;
        name: string;
        amount: number;
        dueDate: string;
        selected: boolean;
    };

    type FeeGroup = {
        id: string;
        name: string;
        selected: boolean;
        expanded: boolean;
        feeTypes: FeeType[];
        price: number;
    };

    let feeGroups = $state<FeeGroup[]>([
        {
            id: 'class1',
            name: 'Class 1 General',
            selected: false,
            expanded: false,
            price: 0,
            feeTypes: [
                { id: 'tuition', name: 'Tuition Fee', amount: 5000, dueDate: '2025-10-11', selected: true },
                { id: 'exam', name: 'Exam Fee', amount: 250, dueDate: '2025-09-09', selected: true },
                { id: 'library', name: 'Library Fee', amount: 300, dueDate: '2025-08-15', selected: false },
                { id: 'sports', name: 'Sports Fee', amount: 500, dueDate: '2025-07-20', selected: true },
            ],
        },
        {
            id: 'class5',
            name: 'Class 5 General',
            selected: false,
            expanded: false,
            price: 0,
            feeTypes: [
                { id: 'tuition', name: 'Tuition Fee', amount: 6500, dueDate: '2025-10-11', selected: false },
                { id: 'exam', name: 'Exam Fee', amount: 300, dueDate: '2025-09-09', selected: false },
                { id: 'lab', name: 'Lab Fee', amount: 1200, dueDate: '2025-08-01', selected: false },
            ],
        },
        {
            id: 'class4',
            name: 'Class 4 General',
            selected: false,
            expanded: false,
            price: 0,
            feeTypes: [
                { id: 'tuition', name: 'Tuition Fee', amount: 6000, dueDate: '2025-10-11', selected: false },
                { id: 'activity', name: 'Activity Fee', amount: 800, dueDate: '2025-09-01', selected: false },
            ],
        },
    ]);


    // Reactive function to update group prices and selection status
    function updateGroupCalculations() {
        feeGroups = feeGroups.map((group) => {
            const price = group.feeTypes.reduce((sum, fee) => (fee.selected ? sum + fee.amount : sum), 0);
            // Changed this line to only unselect group if ALL fee types are unselected
            const anySelected = group.feeTypes.length > 0 
                ? group.feeTypes.some((fee) => fee.selected)
                : group.selected;
            
            return {
                ...group,
                price,
                selected: anySelected, // Group selected if any fee type is selected
            };
        });
    }

    // Calculate total price reactively
    let totalPrice = $derived(
        feeGroups.reduce((sum, group) => (group.selected ? sum + group.price : sum), 0)
    );

    function toggleGroupExpand(groupId: string) {
        feeGroups = feeGroups.map((group) =>
            group.id === groupId ? { ...group, expanded: !group.expanded } : group
        );
    }

    function toggleGroupSelect(groupId: string) {
        feeGroups = feeGroups.map((group) => {
            if (group.id === groupId) {
                const newSelected = !group.selected;
                return {
                    ...group,
                    selected: newSelected,
                    feeTypes: group.feeTypes.map((fee) => ({
                        ...fee,
                        selected: newSelected,
                    })),
                };
            }
            return group;
        });
        updateGroupCalculations();
    }

    function toggleFeeTypeSelect(groupId: string, feeTypeId: string) {
        feeGroups = feeGroups.map((group) => {
            if (group.id === groupId) {
                const updatedFeeTypes = group.feeTypes.map((fee) =>
                    fee.id === feeTypeId ? { ...fee, selected: !fee.selected } : fee
                );

                return {
                    ...group,
                    feeTypes: updatedFeeTypes,
                };
            }
            return group;
        });
        updateGroupCalculations();
    }

    // Initialize calculations
    updateGroupCalculations();

    function formatDate(dateString: string): string {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
</script>
<div class="fee-container">
	{#each feeGroups as group (group.id)}
		<div class="fee-group {group.selected ? 'selected' : ''} {group.expanded ? 'expanded' : ''}">
			<div class="fee-group-header" role="button" tabindex="0" onclick={() => toggleGroupExpand(group.id)} onkeydown={() => toggleGroupExpand(group.id)}>
				<input
					type="checkbox"
					class="checkbox"
					checked={group.selected}
					onclick={(e) => {
						e.stopPropagation();
						toggleGroupSelect(group.id);
					}}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.stopPropagation();
							toggleGroupSelect(group.id);
						}
					}} />

				<div class="fee-group-title">
					{group.name}
				</div>

				<div class="fee-group-price">
					{group.price.toFixed(2)}
				</div>

				<svg
					class="expand-icon"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>

			{#if group.expanded}
				<table>
					<thead>
						<tr>
							<th>Fee Type</th>
							<th>Due Date</th>
							<th class="amount-cell">Amount</th>
						</tr>
					</thead>
					<tbody>
						{#each group.feeTypes as fee (fee.id)}
							<tr>
								<td>
									<div class="fee-type-name">
										<input
											type="checkbox"
											class="checkbox"
											checked={fee.selected}
											onclick={(e: Event) => {
												e.stopPropagation();
												toggleFeeTypeSelect(group.id, fee.id);
											}} />
										{fee.name}
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
			{/if}
		</div>
	{/each}

	<div class="total-box">
		<div class="total-label">Total Amount</div>
		<div class="total-amount">{totalPrice.toFixed(2)}</div>
	</div>
</div>

<style>
	.fee-container {
		width: 100%;
		max-width: 100%;
		margin: 0.5rem auto;
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
		/* background-color: #f0f9ff; */
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

	.fee-type-name {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.amount-cell {
		text-align: right;
	}
	.total-box {
		/* background-color: #f8fafc; */
		padding: 0.5rem;
		border-radius: 6px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		/* border: 1px solid #e2e8f0; */
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
