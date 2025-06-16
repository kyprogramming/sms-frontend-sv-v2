<script lang="ts">
	import Header from '$lib/components/layouts/Header.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { isLoading } from '$lib/stores/loading';
	import { validateForm } from '$lib/utils/validate';
	import { apiRequest } from '$lib/utils/api';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { API_BASE_URL } from '$lib/utils/env.config';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { Eye, EyeOff } from '@lucide/svelte';
	import { loginFormSchema, type LoginFormDataType } from '$lib/utils/schemas';
	import { formErrors } from '$lib/stores/formStore';

	formErrors.set({ email: '', password: '' });
	let formData: LoginFormDataType = $state({ email: 'username1@xyz.com', password: 'password1' });
	let touched: Partial<Record<keyof LoginFormDataType, boolean>> = $state({ email: false, password: false });
	let formSubmitted: boolean = $state(false);
	let showPassword = $state(false);

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;
		const isValid = validateForm(loginFormSchema, formData);
		if (!isValid) return;
		await handleLogin();
	}

	async function handleLogin() {
		try {
			isLoading.set(true);
			const data = await apiRequest<any>(`${API_BASE_URL}/auth/login`, 'POST', formData);
			showSnackbar({ message: data.message, type: 'success' });
			await invalidateAll();
			await goto(`/${data.data.role}/dashboard`);
		} catch (err: any) {
			showSnackbar({ message: err?.message || 'Unexpected error occurred', type: 'error' });
		} finally {
			isLoading.set(false);
		}
	}

	function handleChange(field: keyof LoginFormDataType, value: string): void {
		formData[field] = value;
		touched = { ...touched, [field]: true };
		validateForm(loginFormSchema, formData);
	}
</script>

<svelte:head>
	<title>Login</title>
</svelte:head>
<Header />

<div class="form-container">
	<div class="card">
		<h2>School Logo</h2>
		<h3>Login to Your Account</h3>
		<p class="text-muted">Enter your credentials below</p>

		<form onsubmit={onSubmit} novalidate>
			<div>
				<label for="email">Username</label>
				<input type="email" name="email" placeholder="Enter your username" bind:value={formData.email} class={`w-full ${$formErrors.email && (touched.email || formSubmitted) ? 'input-error' : ''}`} oninput={(e) => handleChange('email', (e.target as HTMLInputElement).value)} onblur={(e) => handleChange('email', (e.target as HTMLInputElement).value)} />
				{#if $formErrors.email && (touched.email || formSubmitted)}
					<p class="error-text">{$formErrors.email}</p>
				{/if}
			</div>

			<div>
				<label for="password">Password</label>
				<div class="input-wrapper position-relative">
					<input
						type={showPassword ? 'text' : 'password'}
						name="password"
						placeholder="Enter your password"
						bind:value={formData.password}
						class={`w-full pr-10 ${$formErrors.password && (touched.password || formSubmitted) ? 'input-error' : ''}`}
						oninput={(e) => handleChange('password', (e.target as HTMLInputElement).value)}
						onblur={(e) => handleChange('password', (e.target as HTMLInputElement).value)}
					/>

					<span
						class="eye-icon"
						role="button"
						tabindex="0"
						aria-label={showPassword ? 'Hide password' : 'Show password'}
						onclick={() => {
							showPassword = !showPassword;
						}}
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								showPassword = !showPassword;
							}
						}}
					>
						{#if showPassword}
							<EyeOff size={18} />
						{:else}
							<Eye size={18} />
						{/if}
					</span>
				</div>

				{#if $formErrors.password && (touched.password || formSubmitted)}
					<p class="error-text">{$formErrors.password}</p>
				{/if}
			</div>
			<button class="btn ripple" type="submit" disabled={$isLoading}>
				<LoaderIcon />
				Sign In
			</button>
		</form>

		<div class="forgot-password">
			<a href="/forgot-password">Forgot password?</a>
		</div>
	</div>
</div>

<style>
	.form-container {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
		height: 90vh;
	}

	.forgot-password {
		text-align: center;
		margin-top: 8px;
	}

	.forgot-password a {
		color: #2563eb;
		text-decoration: none;
	}

	.position-relative {
		position: relative;
	}

	.eye-icon {
		position: absolute;
		top: 25%;
		left: auto;
		right: 12px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 10;
		color: #666;
	}

	.eye-icon:hover {
		opacity: 0.8;
	}
</style>
