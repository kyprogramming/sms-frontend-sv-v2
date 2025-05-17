<script lang="ts">
	import { ACTION_COLUMN_WIDTH, DEFAULT_PAGE_LIMIT } from "$lib/constants/env.config";
	import { get } from "svelte/store";
	import Pagination from "./Pagination.svelte";
	import { currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import type { ActionConfig, ColumnConfig } from "$lib/interfaces/table.interface";

	export let response: any;
    // console.log("RESPONSE on TABLE", response);
	export let dataKey = "data"; // Default key for the data array
	export let paginationKey = "pagination"; // Default key for pagination
	export let onPaginationChange: () => void;
	export let onPageLimitChange: () => void;

	export let columns: ColumnConfig[] = [];
	export let actions: ActionConfig = {
		show: false,
		iconActions: [],
	};

	// Extract data and pagination dynamically
	$: dataArray = response.data?.[dataKey] || [];
	$: paginationData = response.data?.[paginationKey] || { 
		total: 0, 
		page: 1, 
		limit: DEFAULT_PAGE_LIMIT, 
		totalPages: 1 
	};

	// Initialize pagination stores
	$: {
		totalItems.set(paginationData.total);
		rowsPerPage.set(paginationData.limit);
		currentPage.set(paginationData.page);
		totalPages.set(paginationData.totalPages);
	}

   
	// STATE
	let sortColumn = "";
	let sortDirection = 1;

	function sortBy(column: string) {
		if (sortColumn === column) {
			sortDirection *= -1;
		} else {
			sortColumn = column;
			sortDirection = 1;
		}
	}

	$: visibleData = [...dataArray].sort((a, b) => {
		if (!sortColumn) return 0;
		const valA = a[sortColumn]?.toString().toLowerCase() || "";
		const valB = b[sortColumn]?.toString().toLowerCase() || "";
		return valA > valB ? sortDirection : valA < valB ? -sortDirection : 0;
	});
</script>

<!-- TABLE STRUCTURE REMAINS THE SAME AS BEFORE -->
<div class="table-container">
	<div >
		<table>
            <thead>
                <tr>
                    {#each columns as column}
                        <th
                            on:click={() => column.sortable && sortBy(column.key)}
                            class:sortable={column.sortable}
                            style={`width: ${column.width || "auto"}; text-align: ${column.align || "left"}; display: ${column.visible === false ? "none" : "table-cell"};`}
                        >
                            {column.label}
                            {#if column.sortable && sortColumn === column.key}
                                <span>{sortDirection === 1 ? "▲" : "▼"}</span>
                            {/if}
                        </th>
                    {/each}
                    {#if actions?.show}
                        <th style={`width:${ACTION_COLUMN_WIDTH};`}>ACTION</th>
                    {/if}
                </tr>
            </thead>
			<tbody class="table-body-scroll">
				{#each visibleData as item}
					<tr>
						{#each columns as column}
							<td style={`width: ${column.width || "auto"}; text-align: ${column.align || "left"}; display: ${column?.visible === false ? "none" : "table-cell"};`}>
								{#if column.format}
									{column.format(item[column.key])}
								{:else}
									{item[column.key]}
								{/if}
							</td>
						{/each}
						{#if actions?.show}
							<td style="width:150px">
								<span class="action-icons">
                                    {#if actions.iconActions}
									{#each actions.iconActions as action}
                                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                                    <!-- svelte-ignore a11y_no_static_element_interactions -->
										{#if action.show}
											<span class={`icon-wrapper ${action.class}`} on:click={() => action?.action(item)}>
												<svelte:component this={action.icon} />
											</span>
										{/if}
									{/each}
                                    {/if}
								</span>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
            <tfoot>
                <tr>
                    <td colspan={columns.length } style="padding: 3px;">
                        <!-- <p>{columns.length + (actions?.show ? 2 : 1)}</p> -->
                        {#if $totalItems > 0}
                            <div style="display: flex; justify-content: space-between; align-items: center; margin: 5px;">
                                <p style="font-weight: bold;"><b style="font-size: larger; color: blue;">{$totalItems}</b> record(s) found on {$totalPages} page(s)</p>
                                {#if $totalItems > Number(DEFAULT_PAGE_LIMIT)}
                                    <Pagination {onPaginationChange} {onPageLimitChange} />
                                {/if}
                            </div>
                        {:else}
                            <p style="text-align: center; font-weight: bold; margin: 5px;">{response.message || 'No records found'}.</p>
                        {/if}
                    </td>
                </tr>
            </tfoot>
		</table>
	</div>
</div>
<!-- prettier-ignore -->
<style>
	.sortable {
		cursor: pointer;
	}
	.sortable:hover {
		background-color: #f5f5f5;
	}
	.action-icons {display: flex; gap: 1rem; }
	/* .icon-wrapper {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		border-radius: 4px;
	} */
	.icon-wrapper:hover {
		background-color: #f0f0f0;
	}

	.table-container {
		display: flex;
		flex-direction: column;
		max-height: 800px;
		overflow: hidden;
		border: 1px solid #ddd;
	}

	.table-container table {
		width: 100%;
		border-collapse: collapse;
	}

	.table-body-scroll {
		overflow-y: auto;
		max-height: 600px; /* Adjust as needed */
	}

	.table-body-scroll table {
		width: 100%;
		table-layout: fixed;
	}

	/* .table-body-scroll td,
	th {
		padding: 8px;
		 border: 1px solid #ddd;
	} */
</style>
