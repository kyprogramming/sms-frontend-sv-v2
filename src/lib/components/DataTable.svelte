<script context="module" lang="ts">
	export interface ColumnConfig {
		key: string;
		label: string;
		sortable?: boolean;
		type?: "text" | "number" | "date";
		format?: (value: any) => string;
		width?: string;
		align?: "left" | "center" | "right";
		visible?: boolean;
	}

	export interface ActionIconConfig {
		show?: boolean;
		edit?: boolean;
		delete?: boolean;
	}

	export interface CustomAction {
		icon: any;
		action: (item: any) => void;
	}

	export interface ActionConfig {
		show?: boolean;
		icons?: ActionIconConfig;
		customActions?: CustomAction[];
		deleteAction?: (item: any) => void;
	}
</script>

<script lang="ts">
	import Pagination from "../../routes/dashboard/admin/class/Pagination.svelte";

	export let response: any;
	console.log("RESPONSE on TABLE", response);
	let { success, message } = response;
	let { sections, pagination } = response.data;

	export let columns: ColumnConfig[] = [];
	export let actions: ActionConfig = {
		show: false,
		icons: {
			show: false,
			edit: false,
			delete: false,
		},
		customActions: [],
	};

	// console.log("data object received", response);
	let totalItems: number = pagination.total;
	let rowsPerPage: number = pagination.limit;
	let currentPage: number = pagination.page;
	let totalPages: number = pagination.totalPages;

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

	$: visibleData = [...sections].sort((a, b) => {
		if (!sortColumn) return 0;
		const valA = a[sortColumn]?.toString().toLowerCase() || "";
		const valB = b[sortColumn]?.toString().toLowerCase() || "";
		return valA > valB ? sortDirection : valA < valB ? -sortDirection : 0;
	});
</script>

<!-- TABLE -->
<div class="table-container">
	<table>
		<thead>
			<tr>
				<!-- <th><input type="checkbox" /></th> -->
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
					<th>ACTION</th>
				{/if}
			</tr>
		</thead>
		<tbody>
			{#each visibleData as item}
				<tr>
					<!-- <td><input type="checkbox" /></td> -->
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
						<td style="width:250px">
							<span class="action-icons">
								{#if actions.customActions}
									{#each actions.customActions as action}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_static_element_interactions -->
										<span class="icon-wrapper" on:click={() => action?.action(item)}>
											<svelte:component this={action.icon} size={15} />
										</span>
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
				<td colspan={columns.length + (actions?.show ? 2 : 1)} style="padding: 3px;">
					{#if totalItems > 0}
						<p style="text-align: left; font-weight:bold; margin-top:10px; margin-left:auto">Total records: {totalItems}</p>
						{#if totalPages > 1}
							<Pagination {totalItems} {rowsPerPage} {currentPage} />
						{/if}
					{:else}
						<p style="text-align: center; font-weight:bold; margin-top:10px;">{message}.</p>
					{/if}
				</td>
			</tr>
		</tfoot>
	</table>
</div>

<style>
	.sortable {
		cursor: pointer;
	}
	.sortable:hover {
		background-color: #f5f5f5;
	}
	.action-icons {
		display: flex;
		gap: 8px;
	}
	.icon-wrapper {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 4px;
		border-radius: 4px;
	}
	.icon-wrapper:hover {
		background-color: #f0f0f0;
	}
</style>
