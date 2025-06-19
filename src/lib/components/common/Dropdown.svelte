<script lang="ts">
	import type { DropdownItem } from "$lib/utils/interfaces";

	let {
		id = `dropdown-${Math.random().toString(36).substring(2, 9)}`,
		label = '',
		items = [],
		selectedValue = '',
		required = false,
		placeholder = 'Select an option',
		disabled = false
	} = $props();

	let isOpen = $state(false);

	const displayValue = $derived(
		items.find((item) => item._id === selectedValue)?.name || placeholder
	);

	const hasError = $derived(required && !selectedValue);

	function toggleDropdown() {
		if (!disabled) isOpen = !isOpen;
	}

	function selectItem(item: DropdownItem) {
		if (item.disabled) return;
		selectedValue = item._id;
		isOpen = false;

		const changeEvent = new CustomEvent('change', {
			detail: { value: item._id },
			bubbles: true,
			composed: true
		});
		dispatchEvent(changeEvent);
	}

	function handleBlur() {
		setTimeout(() => (isOpen = false), 150);
	}
</script>

<div class="dropdown-container">
	{#if label}
		<label for={id} class="dropdown-label">{label}</label>
	{/if}

	<div class="dropdown" class:open={isOpen} class:error={hasError} class:disabled={disabled}>
		<button
			id={id}
			class="dropdown-toggle"
			onclick={toggleDropdown}
			onblur={handleBlur}
			disabled={disabled}
			aria-haspopup="listbox"
			aria-expanded={isOpen}
		>
			<span class="dropdown-value">{displayValue}</span>
			<svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
				<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>

		{#if isOpen}
			<ul class="dropdown-menu" role="listbox">
				{#each items as item}
					<li
						tabindex={item.disabled ? undefined : 0}
						role="option"
						aria-selected={item._id === selectedValue}
						aria-disabled={item.disabled}
						class="dropdown-item"
						class:selected={item._id === selectedValue}
						class:disabled={item.disabled}
						onclick={() => selectItem(item)}
						onkeydown={(e) => {
							if ((e.key === 'Enter' || e.key === ' ') && !item.disabled) {
								e.preventDefault();
								selectItem(item);
							}
						}}
						onmousedown={(e) => e.preventDefault()}
					>
						{#if item.disabled}
							<span class="dropdown-item-disabled">{item.name}</span>
						{:else}
							<span class="dropdown-item-label">{item.name}</span>
						{/if}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	:global(:root) {
		--primary-color: #099f3e;
		--primary-light: rgba(15, 140, 59, 0.1);
		--error-color: #e53e3e;
		--text-color: #2d3748;
		--border-color: #e2e8f0;
		--hover-bg: #f7fafc;
		--disabled-color: #a0aec0;
	}

	.dropdown-container {
		position: relative;
		width: 100%;
		margin-bottom:0.5rem;
	}

	.dropdown-label {
		display: block;
		font-size: 0.875rem;
		color: var(--text-color);
		font-weight: 500;
		margin-bottom: 0.5rem;
	}

	.dropdown {
		position: relative;
		width: 100%;
	}

	.dropdown-toggle {
		width: 100%;
		padding: 0.60rem 0.75rem;
		font-size: 0.8375rem;
		color: var(--text-color);
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		transition: all 0.2s ease;
	}

	.dropdown-toggle:hover:not(:disabled) {
		border-color: #cbd5e0;
	}

	.dropdown-toggle:focus {
		outline: none;
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px var(--primary-light);
	}

	.dropdown.open .dropdown-toggle {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px var(--primary-light);
	}

	.dropdown.error .dropdown-toggle {
		border-color: var(--error-color);
	}

	.dropdown.disabled .dropdown-toggle {
		background-color: #f7fafc;
		color: var(--disabled-color);
		cursor: not-allowed;
	}

	.dropdown-value {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.dropdown-icon {
		width: 1rem;
		height: 1rem;
		margin-left: 0.5rem;
		transition: transform 0.2s ease;
	}

	.dropdown.open .dropdown-icon {
		transform: rotate(180deg);
	}

	.dropdown-menu {
		position: absolute;
		width: 100%;
		max-height: 300px;
		overflow-y: auto;
		margin-top: 2px;
		padding: 0.25rem 0;
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		z-index: 10;
		list-style: none;
	}

	.dropdown-item {
		padding: 0.5rem 0.75rem;
		cursor: pointer;
		transition: all 0.1s ease;
	}

	.dropdown-item:hover:not(.disabled) {
		background-color: var(--hover-bg);
	}

	.dropdown-item.selected {
		background-color: var(--primary-light);
		color: var(--primary-color);
		font-weight: 500;
	}

	.dropdown-item.disabled {
		color: var(--disabled-color);
		cursor: not-allowed;
	}
</style>
