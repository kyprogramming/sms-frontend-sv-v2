<script lang="ts">
	import { run } from 'svelte/legacy';

	import { ACTION_COLUMN_WIDTH, DEFAULT_PAGE_LIMIT } from "$lib/constants/env.config";
	import { get } from "svelte/store";
	import Pagination from "./Pagination.svelte";
	import { currentPage, rowsPerPage, totalPages, totalItems } from "$lib/stores/paginationStore";
	import type { ActionConfig, ColumnConfig } from "$lib/interfaces/table.interface";

	

	interface Props {
		response: any;
		// console.log("RESPONSE on TABLE", response);
		dataKey?: string; // Default key for the data array
		paginationKey?: string; // Default key for pagination
		onPaginationChange: () => void;
		onPageLimitChange: () => void;
		columns?: ColumnConfig[];
		actions?: ActionConfig;
	}

	let {
		response,
		dataKey = "data",
		paginationKey = "pagination",
		onPaginationChange,
		onPageLimitChange,
		columns = [],
		actions = {
		show: false,
		iconActions: [],
	}
	}: Props = $props();


	// STATE
	let sortColumn = $state("");
	let sortDirection = $state(1);

	function sortBy(column: string) {
		if (sortColumn === column) {
			sortDirection *= -1;
		} else {
			sortColumn = column;
			sortDirection = 1;
		}
	}


	function getNestedValue(obj: any, path: string): any {
		return path.split(".").reduce((acc, part) => acc && acc[part], obj);
	}
	// console.log("response.data:", response.data);
	// Extract data and pagination dynamically
	let dataArray = $derived(response.data?.[dataKey] || []);
	let paginationData = $derived(response.data?.[paginationKey] || {
		total: 0,
		page: 1,
		limit: DEFAULT_PAGE_LIMIT,
		totalPages: 1,
	});
	// Initialize pagination stores
	run(() => {
		totalItems.set(paginationData.total);
		rowsPerPage.set(paginationData.limit);
		currentPage.set(paginationData.page);
		totalPages.set(paginationData.totalPages);
	});
	let visibleData = $derived([...dataArray].sort((a, b) => {
		if (!sortColumn) return 0;
        const valA = getNestedValue(a, sortColumn)?.toString().toLowerCase() || "";
        const valB = getNestedValue(b, sortColumn)?.toString().toLowerCase() || "";
		return valA > valB ? sortDirection : valA < valB ? -sortDirection : 0;
	}));
</script>

<!-- TABLE STRUCTURE REMAINS THE SAME AS BEFORE -->
<div class="table-container">
	<div>
		<table>
			<thead>
				<tr>
					{#each columns as column}
						<th
							onclick={() => column.sortable && sortBy(column.key)}
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
									{column.format(getNestedValue(item, column.key))}
								{:else}
									{getNestedValue(item, column.key)}
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
												<span class={`icon-circle ${action.class}`} onclick={() => action?.action(item)}>
													<action.icon />
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
					<td colspan={columns.length} style="padding: 3px;">
						<!-- <p>{columns.length + (actions?.show ? 2 : 1)}</p> -->
						{#if $totalItems > 0}
							<div style="display: flex; justify-content: space-between; align-items: center; margin: 5px;">
								<p style="margin: 0; font-weight: bold;">Total <b style="font-size: 15px; color: var(--clr-pri);">{$totalItems}</b> record(s) found on {$totalPages} page(s)</p>
								{#if $totalItems > Number(DEFAULT_PAGE_LIMIT)}
									<Pagination {onPaginationChange} {onPageLimitChange} />
								{/if}
							</div>
						{:else}
							<p style="margin: 0;text-align: left; font-weight: bold; margin: 5px;">{response.message || "No records found"}.</p>
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
	.action-icons {display: flex; gap: 0.5rem; }
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
