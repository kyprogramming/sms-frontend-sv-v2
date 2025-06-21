<script lang="ts">
	import { formErrors } from '$lib/stores/formStore';
	import { validateForm } from '$lib/utils/validateHelper';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { closeModal } from '$lib/stores/modalStore';
	import { createConstant, updateConstant } from '$lib/services/constant';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { isLoading } from '$lib/stores/loading';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { CONSTANT_CATEGORIES } from '$lib/utils/constants';
	import { constantFormSchema, type ConstantPayload } from '$lib/schemas/constant.schema';

	let { onRefreshPage, constantData = null, action } = $props();

	export function initializeConstantFormData(): ConstantPayload {
		return {
			key: '',
			value: '',
			type: 'string',
			category: '',
			description: '',
		};
	}

	let formData: ConstantPayload = $state(initializeConstantFormData());
	let touched: Partial<Record<keyof ConstantPayload, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	// console.log("constantData: ", constantData);

	onMount(() => {
		populateFormData();
		formErrors.set({});
	});

	function handleResetForm() {
		populateFormData();
		formErrors.set({});
		formSubmitted = false;
		touched = {};
	}

	function populateFormData() {
		if (action === 'update' && constantData) {
			formData = { ...constantData };
		} else {
			formData = initializeConstantFormData();
		}
	}

	function handleChange(field: keyof ConstantPayload, value: any) {
		formData[field] = value;
		touched = { ...touched, [field]: true };
		// console.log("formData", formData);
		validateForm(constantFormSchema, formData);
	}

	function handleTypeChange(type: string) {
		// Only reset value if a valid type is selected
		if (type && ['string', 'number', 'boolean', 'json'].includes(type)) {
			switch (type) {
				case 'number':
					formData.value = 0;
					break;
				case 'boolean':
					formData.value = false;
					break;
				case 'json':
					formData.value = '{}';
					break;
				default:
					formData.value = '';
			}
		}
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(constantFormSchema, formData);
		if (!isValid) return;

		try {
			if (action === 'update' && constantData) {
				const isUnChanged = isEqual(constantData, formData);
				if (isUnChanged) {
					showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
					return;
				}
				await updateConstant(constantData._id, formData);
				showSnackbar({ message: 'Constant updated successfully', type: 'success' });
			} else {
				await createConstant(formData);
				showSnackbar({ message: 'Constant created successfully', type: 'success' });
			}
			closeModal();
			onRefreshPage();
		} catch (error: any) {
			showSnackbar({ message: error.message, type: 'error' });
		}
	}
</script>

<form onsubmit={onSubmit}>
	<div class="card-wrapper">
		<div class="grid-12">
			<div class="col-4">
				<label for="category">Category</label>
				<select id="category" bind:value={formData.category} onchange={(e) => (formData.category = (e.target as HTMLSelectElement).value || '')}>
					<option value="" selected>Select Category</option>
					{#each CONSTANT_CATEGORIES as category}
						<option value={category.name}>{category.name}</option>
					{/each}
				</select>
			</div>
			<div class="col-4">
				<label for="key">Key <span class="required">*</span></label>
				<input id="key" type="text" name="key" placeholder="Constant key" class={`w-full ${$formErrors.key && (touched.key || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.key} oninput={(e) => handleChange('key', (e.target as HTMLInputElement).value)} onblur={() => handleChange('key', formData.key)} />
				{#if $formErrors.key && (touched.key || formSubmitted)}
					<p class="error-text">{$formErrors.key}</p>
				{/if}
			</div>
			<div class="col-4">
				<label for="type">Type <span class="required">*</span></label>
				<select
					id="type"
					name="type"
					class={`w-full ${$formErrors.type && (touched.type || formSubmitted) ? 'input-error' : ''}`}
					bind:value={formData.type}
					onchange={(e) => {
						const value = (e.target as HTMLSelectElement).value;
						if (value === 'string' || value === 'number' || value === 'boolean' || value === 'json') {
							handleTypeChange(value);
						}
					}}>
					<!-- <option value="" selected>Select Type</option> -->
					<option value="string">String</option>
					<option value="number">Number</option>
					<option value="boolean">Boolean</option>
					<option value="json">JSON</option>
				</select>
				{#if $formErrors.type && (touched.type || formSubmitted)}
					<p class="error-text">{$formErrors.type}</p>
				{/if}
			</div>

			<div class="col-12">
				<label for="value">Value <span class="required">*</span></label>
				{#if formData.type === 'string'}
					<input id="value" type="text" name="value" placeholder="Enter string value" class={`w-full ${$formErrors.value && (touched.value || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.value} oninput={(e) => handleChange('value', (e.target as HTMLInputElement).value)} />
				{:else if formData.type === 'number'}
					<input id="value" type="number" name="value" placeholder="Enter number value" class={`w-full ${$formErrors.value && (touched.value || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.value} oninput={(e) => handleChange('value', Number((e.target as HTMLSelectElement).value))} />
				{:else if formData.type === 'boolean'}
					<select id="value" name="value" class={`w-full ${$formErrors.value && (touched.value || formSubmitted) ? 'input-error' : ''}`} value={formData.value ? 'true' : 'false'} onchange={(e) => handleChange('value', (e.target as HTMLSelectElement).value === 'true')}>
						<option value="true">True</option>
						<option value="false">False</option>
					</select>
				{:else if formData.type === 'json'}
					<textarea
						id="value"
						name="value"
						placeholder="key:value"
						class={`w-full font-mono ${$formErrors.value && (touched.value || formSubmitted) ? 'input-error' : ''}`}
						value={typeof formData.value === 'string' ? formData.value : JSON.stringify(formData.value, null, 2)}
						oninput={(e) => {
							try {
								const parsed = JSON.parse((e.target as HTMLTextAreaElement).value);
								handleChange('value', parsed);
							} catch {
								handleChange('value', (e.target as HTMLTextAreaElement).value);
							}
						}}></textarea>
				{/if}

				{#if $formErrors.value && (touched.value || formSubmitted)}
					<p class="error-text">{$formErrors.value}</p>
				{/if}
			</div>

			<div class="col-12">
				<div class="input-wrapper">
					<label for="description">Description</label>
					<textarea id="description" name="description" placeholder="Optional description" class="w-full" bind:value={formData.description} oninput={(e) => handleChange('description', (e.target as HTMLInputElement).value)}></textarea>
				</div>
			</div>

			<div class="col-12">
				<div class="form-actions">
					<button type="button" class="btn ripple btn-secondary" onclick={handleResetForm} disabled={$isLoading}>
						<BrushCleaning />
						<span>Reset Form</span>
					</button>

					<button class="btn ripple" type="submit" disabled={$isLoading}>
						<LoaderIcon />
						{#if !$isLoading}
							<Save />
						{/if}
						{#if action === 'update'}
							Update Constant
						{:else}
							Create Constant
						{/if}
					</button>
				</div>
			</div>
		</div>
	</div>
</form>
