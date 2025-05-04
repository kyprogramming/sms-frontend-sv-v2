<script lang="ts">
	import Header from "$lib/components/layouts/Header.svelte";
	import { z } from "zod";
	import { goto } from "$app/navigation";
	import { isLoading } from "$lib/stores/loading";
	import LoadingBar from "$lib/components/LoadingBar.svelte";
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

	let formData: LoginFormData = {
		email: "username1@xyz.com",
		password: "password1",
	};

	const formErrors = writable<{ email?: string; password?: string }>({});
	const touched = writable<Partial<Record<keyof LoginFormData, boolean>>>({
		email: false,
		password: false,
	});

	let error: string = "";

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
            showSnackbar({message: data.message ,type: "success"});
			goto(`/dashboard/${data.data.role}`);
		} catch (err: any) {
			error = err.message || "Unexpected error occurred";
		} finally {
			isLoading.set(false);
		}
	}
</script>

<Header />

<div class="main-card">
	<div class="login-card">
		<h2>School Logo</h2>
		<h3>Login to Your Account</h3>
		<p>Enter your credentials below</p>

		<form on:submit|preventDefault={onSubmit} novalidate>
			<div class="input-wrapper">
				<input
					type="email"
					name="email"
					placeholder="Enter your email"
					bind:value={formData.email}
					class={$formErrors.email && $touched.email ? "input-error" : ""}
					on:input={(e) =>
						handleChange("email", (e.target as HTMLInputElement).value)}
					on:blur={() => touched.update((t) => ({ ...t, email: true }))}
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
					class={$formErrors.password && $touched.password ? "input-error" : ""}
					on:input={(e) =>
						handleChange("password", (e.target as HTMLInputElement).value)}
					on:blur={() => touched.update((t) => ({ ...t, password: true }))}
				/>
				{#if $formErrors.password && $touched.password}
					<p class="error-text">{$formErrors.password}</p>
				{/if}
			</div>

			<div class="forgot-password">
				<a href="forgot-password">Forgot password?</a>
			</div>

			<button type="submit" disabled={$isLoading}>
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
  .main-card { display: flex; justify-content: center; align-items: center; height: 90vh; }
  .login-card { background-color: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%; text-align: center; }
  .login-card h2, .login-card h3 { margin: 0; }
  .login-card h3 { margin-top: 1rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
  .login-card p { margin-bottom: 1.5rem; font-size: 0.9rem; }
  .input-wrapper { margin-bottom: 1rem; text-align: left; }
  input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 0.5rem; font-size: 1rem; transition: border 0.2s; }
  input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
  select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2); }
  .input-error { border-color: #ef4444; }
  .error-text { font-size: 0.75rem; color: #ef4444; margin-top: 0.25rem; }
  .server-error { margin-top: 1rem; color: #ef4444; font-weight: 600; }
  .forgot-password { text-align: right; margin-bottom: 1rem; font-size: 0.875rem; }
  .forgot-password a { color: #2563eb; text-decoration: none; }
  button { width: 100%; padding: 0.75rem; background-color: #2563eb; color: white; font-size: 1rem; border: none; border-radius: 0.5rem; cursor: pointer; position: relative; }
  button[disabled] { opacity: 0.6; cursor: not-allowed; }
  .spinner { height: 1.25rem; width: 1.25rem; animation: spin 1s linear infinite; margin: 0 auto; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .signup { margin-top: 1rem; font-size: 0.875rem; }
  .signup a { color: #2563eb; text-decoration: none; }
</style>
