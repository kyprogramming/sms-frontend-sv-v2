<script lang="ts">
	interface Props {
		id?: string;
		label?: string;
		checked?: boolean;
		required?: boolean;
		name?: string;
		onchange?: (event: Event) => void;
	}

	let { id = '', label = '', checked = $bindable(false), required = false, name = '', onchange = (e: Event) => {} }: Props = $props();

	function handleToggle(event: MouseEvent | KeyboardEvent) {
		event.preventDefault();
		checked = !checked;
		// Create a new change event to mimic native checkbox behavior
		const changeEvent = new Event('change', { bubbles: true });
		if (onchange) {
			onchange(changeEvent);
		}
	}

	// Forward the native change event
	// function handleInputChange(e: Event) {
	// 	checked = (e.target as HTMLInputElement).checked;
	// 	console.log('Checkbox changed:', checked);
	// 	if (onchange) {
	// 		onchange(e);
	// 	}
	// }
</script>

<div class="switch-container">
	<label for={id} class="switch-label">{label}</label>
	<button
		{id}
		class="switch"
		class:required-error={required && !checked}
		role="switch"
		aria-label={label || 'Toggle switch'}
		aria-checked={checked}
		onclick={handleToggle}
		onkeydown={(e) => e.key === ' ' && handleToggle(e)}>
		<span class="track"></span>
		<span class="slider {checked ? 'on' : ''}">
			<svg class="checkmark" viewBox="0 0 24 24" fill="none">
				<path d="M5 13L10 18L19 7" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</span>
	</button>
	<!-- <input type="checkbox" class="checkbox-input" {name} bind:checked {required} onchange={handleInputChange} aria-hidden="true" style="display: none;" /> -->
</div>

<style>
	:global(:root) {
		--parrot-green: #099f3e;
		--parrot-green-dark: #30b360;
		--parrot-green-light: rgba(15, 140, 59, 0.3);
		--track-width: 4.25rem;
		--slider-size: 2.25rem;
		--error-red: #e53e3e;
	}

	.switch-container {
		align-items: center;
		gap: 1rem;
		font-family:
			'Inter',
			-apple-system,
			sans-serif;
		margin-right: auto;
		margin-top: 6px;
		position: relative;
		margin-right: auto;
	}

	.switch-label {
		font-size: 0.9375rem;
		color: #2d3748;
		font-weight: 500;
		user-select: none;
	}

	.switch {
		--track-height: 1.5rem;
		position: relative;
		width: var(--track-width);
		height: var(--slider-size);
		border: none;
		background: transparent;
		cursor: pointer;
		padding: 0;
		outline: none;
	}

	.track {
		position: absolute;
		top: calc((var(--slider-size) - var(--track-height)) / 2);
		left: 0;
		width: 100%;
		height: var(--track-height);
		border-radius: 100px;
		background: #e2e8f0;
		transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow: inset 0 1px 4px rgba(0, 0, 0, 0.08);
	}

	.switch:hover .track {
		background: #cbd5e0;
	}

	.switch[aria-checked='true'] .track {
		background: var(--parrot-green-light);
	}

	.slider {
		position: absolute;
		top: 0;
		left: 0;
		width: var(--slider-size);
		height: var(--slider-size);
		background-color: white;
		border-radius: 50%;
		box-shadow:
			0 3px 8px rgba(0, 0, 0, 0.15),
			0 0 0 2px #e2e8f0;
		transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.slider.on {
		transform: translateX(calc(var(--track-width) - var(--slider-size)));
		background-color: var(--parrot-green);
		box-shadow:
			0 3px 8px rgba(0, 0, 0, 0.15),
			0 0 0 2px var(--parrot-green-light);
	}

	.checkmark {
		width: 60%;
		height: 60%;
		color: white;
		opacity: 0;
		transform: scale(0.8);
		transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
	}

	.slider.on .checkmark {
		opacity: 1;
		transform: scale(1);
	}

	/* Error state when required but not checked */
	.switch.required-error .track {
		box-shadow: inset 0 0 0 2px var(--error-red);
	}

	.switch.required-error .slider {
		box-shadow:
			0 3px 8px rgba(0, 0, 0, 0.15),
			0 0 0 2px var(--error-red);
	}

	/* Focus state */
	.switch:focus-visible {
		outline: 2px solid var(--parrot-green);
		outline-offset: 2px;
	}

	/* Spring animation */
	@keyframes spring {
		0% {
			transform: translateX(0) scale(1);
		}
		30% {
			transform: translateX(15%) scale(1.1);
		}
		60% {
			transform: translateX(-5%) scale(0.95);
		}
		100% {
			transform: translateX(0) scale(1);
		}
	}

	.switch:active .slider {
		animation: spring 0.4s ease;
	}

	/* Pulse effect on toggle */
	@keyframes pulse {
		0% {
			box-shadow: 0 0 0 0 var(--parrot-green-light);
		}
		70% {
			box-shadow: 0 0 0 10px transparent;
		}
		100% {
			box-shadow: 0 0 0 0 transparent;
		}
	}

	.slider.on {
		animation: pulse 0.6s ease-out;
	}
</style>
