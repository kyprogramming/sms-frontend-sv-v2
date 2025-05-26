<script lang="ts">
	import Header from "$lib/components/layouts/Header.svelte";
	import { z } from "zod";
	import { goto, invalidateAll } from "$app/navigation";
	import { isLoading } from "$lib/stores/loading";

	import { writable } from "svelte/store";
	import { validateForm } from "$lib/utils/validate";
	import { apiRequest } from "$lib/utils/api";
	import { showSnackbar } from "$lib/components/snackbar/store";

	const loginSchema = z.object({
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
	});

	type LoginFormData = {
		email: string;
		password: string;
	};

	let formData: LoginFormData = $state({
		email: "username1@xyz.com",
		password: "password1",
	});

	const formErrors = writable<{ email?: string; password?: string }>({});
	const touched = writable<Partial<Record<keyof LoginFormData, boolean>>>({
		email: false,
		password: false,
	});

	let error: string = $state("");

	function handleChange(field: keyof LoginFormData, value: string): void {
		formData[field] = value;
		touched.update((t) => ({ ...t, [field]: true }));
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		const isValid = await validateForm(loginSchema, formData, formErrors);
		if (!isValid) return;
		await handleLogin();
	}

	async function handleLogin() {
		try {
			// Call api
			isLoading.set(true);
			const data = await apiRequest<any>("/api/auth/login", "POST", formData);
			if (!data.success) throw new Error(data.message || "Login failed");

			// redirect to dashboard page
			showSnackbar({ message: data.message, type: "success" });
            await invalidateAll(); 
			await goto(`/${data.data.role}/dashboard`);
            // await goto(`/help`);
            
		} catch (err: any) {
			error = err?.message || "Unexpected error occurred";
		} finally {
			isLoading.set(false);
		}
	}
</script>

<Header />

<div class="form-container">
	<div class="form-card">
		<h2>School Logo</h2>
		<h3>Login to Your Account</h3>
		<p>Enter your credentials below</p>

        <form onsubmit={onSubmit} novalidate>
			<div class="input-wrapper">
				<input
					type="email"
					name="email"
					placeholder="Enter your email"
					bind:value={formData.email}
					class={`w-full ${$formErrors.password && $touched.password ? "input-error" : ""}`}
					oninput={(e) => handleChange("email", (e.target as HTMLInputElement).value)}
					onblur={() => touched.update((t) => ({ ...t, email: true }))}
				/>
				{#if $formErrors.email && $touched.email}
					<p class="error-text">{$formErrors.email}</p>
				{/if}
			</div>

			<div class="input-wrapper">
				<input
					type="password"
					name="password"
					placeholder="Enter your password"
					bind:value={formData.password}
					class={`w-full ${$formErrors.password && $touched.password ? "input-error" : ""}`}
					oninput={(e) => handleChange("password", (e.target as HTMLInputElement).value)}
					onblur={() => touched.update((t) => ({ ...t, password: true }))}
				/>
				{#if $formErrors.password && $touched.password}
					<p class="error-text">{$formErrors.password}</p>
				{/if}
			</div>

			<div class="forgot-password">
				<a href="forgot-password">Forgot password?</a>
			</div>

			<button class="btn ripple" style="width: 100%; justify-content: center;" type="submit" disabled={$isLoading}>
				{#if $isLoading}
					<!-- <img src="/spinner.svg" alt="Loading..." class="spinner" /> -->
					Loading...
				{:else}
					Login
				{/if}
			</button>
		</form>

		<div class="signup">
			Don't have an account? <a href="/sign-up">Sign up</a>
		</div>

		{#if error}
			<p class="server-error">{error}</p>
		{/if}
	</div>
</div>

<!-- prettier-ignore -->
<style>
 








</style>
