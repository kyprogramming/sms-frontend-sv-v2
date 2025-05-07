<!-- ✅ Correct: module context -->
<script context="module" lang="ts">
	export interface ColumnConfig {
		key: string;
		label: string;
		sortable?: boolean;
		type?: "text" | "number" | "date";
		format?: (value: any) => string;
        width?: string;
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
	}
</script>

<script lang="ts">
	import { Eye, Edit, Trash2 } from "@lucide/svelte";
	import Pagination from "../../routes/dashboard/admin/class/Pagination.svelte";

	// PROPS
	export let data: any[] = [];
	export let columns: ColumnConfig[] = [];
	export let actions: ActionConfig = {
		show: false,
		icons: {
			show: false,
			edit: false,
			delete: false
		},
		customActions: []
	};
	export let totalItems: number = 0;
	export let rowsPerPage: number = 10;
	export let currentPage: number = 1;

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

	// REACTIVE SORTING
	$: visibleData = [...data].sort((a, b) => {
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
				<th><input type="checkbox" /></th>
				{#each columns as column}
					<th
						on:click={() => column.sortable && sortBy(column.key)}
						class:sortable={column.sortable}
                        style={column.width ? `width: ${column.width}` : ""}
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
					<td><input type="checkbox" /></td>
					{#each columns as column}
						<td style={column.width ? `width: ${column.width}` : ""}>
							{#if column.format}
								{column.format(item[column.key])}
							{:else}
								{item[column.key]}
							{/if}
						</td>
					{/each}

					{#if actions?.show}
						<td>
							<span class="action-icons">
								{#if actions.icons?.show}
									<span class="icon-wrapper"><Eye size={15} /></span>
								{/if}
								{#if actions.icons?.edit}
									<span class="icon-wrapper"><Edit size={15} /></span>
								{/if}
								{#if actions.icons?.delete}
									<span class="icon-wrapper"><Trash2 size={15} /></span>
								{/if}
								{#if actions.customActions}
									{#each actions.customActions as action}
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<!-- svelte-ignore a11y_no_static_element_interactions -->
										<span
											class="icon-wrapper"
											on:click={() => action.action(item)}
										>
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
				<td
					colspan={columns.length + (actions?.show ? 2 : 1)}
					style="padding: 3px;"
				>
					<Pagination
						{totalItems}
						{rowsPerPage}
						{currentPage}
					/>
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
