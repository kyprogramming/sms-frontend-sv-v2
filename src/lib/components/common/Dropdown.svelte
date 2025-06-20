<script lang="ts">
	import type { DropdownItem } from '$lib/utils/interfaces';

	let {
		id = `dropdown-${Math.random().toString(36).substring(2, 9)}`,
		label = '',
		items = [],
		selectedValue = $bindable(''),
		placeholder = 'Select an option',
		disabled = false,
		cls = '',
		onSelect = (item: DropdownItem) => {},
		onBlur = () => {},
	} = $props();

	let isOpen = $state(false);

	const displayValue = $derived(
		items.find((item) => item._id === selectedValue)?.name || placeholder,
	);

	function toggleDropdown() {
		if (!disabled) isOpen = !isOpen;
	}

	function selectItem(item: DropdownItem) {
		if (item.disabled) return;
		selectedValue = item._id;
		isOpen = false;
		onSelect?.(item);
	}

	function handleBlur() {
        alert('blur');
		setTimeout(() => {
			isOpen = false;
			onBlur?.();
		}, 150);
	}
</script>

<div class="dropdown-container">
	{#if label}
		<label for={id} class="dropdown-label">{label}</label>
	{/if}

	<div class={`dropdown ${cls}`} class:open={isOpen} class:disabled>
		<button
			{id}
			class="dropdown-toggle"
			onclick={toggleDropdown}
			{disabled}
			aria-haspopup="listbox"
			aria-expanded={isOpen}>
			<span class="dropdown-value">{displayValue}</span>
			<svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
				<path
					d="M6 9L12 15L18 9"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round" />
			</svg>
		</button>

		{#if isOpen}
			<ul class="dropdown-menu" role="listbox">
				<li
					tabindex={0}
					role="option"
					aria-selected={true}
					class="dropdown-item"
					onmousedown={(e) => e.preventDefault()}>
					<span class:dropdown-item-disabled={true}>{placeholder}</span>
				</li>
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
                        onblur={handleBlur}
						onmousedown={(e) => e.preventDefault()}>
						<span class:dropdown-item-disabled={item.disabled}>{item.name}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>

<style>
	:global(:root) {
		--primary-color: var(--info);
		--primary-light: #e4f1ff;
		--error-color: #e53e3e;
		--text-color: #2d3748;
		--border-color: #e2e8f0;
		--hover-bg: #f7fafc;
		--disabled-color: #a0aec0;
	}

	.dropdown-container {
		position: relative;
		width: 100%;
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
		border-radius: 6px;
		width: 100%;
	}

	.dropdown-toggle {
		width: 100%;
		padding: 4px 8px;
		height: 35px;
		font-size: 0.875rem;
		color: var(--text-color);
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		cursor: pointer;
		transition: all 0.2s ease;
		background-color: #f5f5f5;
		border: 1px solid #ccc;
	}

	.dropdown-toggle:hover:not(:disabled) {
		border-color: #cbd5e0;
	}

	.dropdown.open .dropdown-toggle {
		/* textarea:focus {outline: none; border-color: var(--info); box-shadow: 0 0 0 1.5px rgba(59, 130, 246, 0.2); background-color: #ffffff} */
		border-color: var(--info);
		box-shadow: 0 0 0 1.5px rgba(59, 130, 246, 0.2);
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
		margin-top: 0.1rem;
		padding: 0.25rem 0;
		background: white;
		border: 1px solid var(--border-color);
		border-radius: 6px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

	.dropdown-item-disabled {
		opacity: 0.6;
	}
</style>
