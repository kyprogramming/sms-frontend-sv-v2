<script lang="ts">
	import { page } from '$app/state';
	const status = page.status;
	const message = page?.error?.message;
	// console.log("Error Page:", { message, status });
</script>

<div class="error-container">
	<h1 class="title">Oops!!!</h1>
	<p class="subtitle">Something went wrong.</p>

	<div class="status-box">
		<h2>{status}</h2>
		<p>{message}</p>
	</div>

	{#if status === 400}
		<p>Bad request. Please check your input and try again.</p>
	{:else if status === 401}
		<p>Unauthorized. Please <a href="/login">log in</a> again.</p>
	{:else if status === 403}
		<p>Forbidden. You don't have permission to access this page.</p>
	{:else if status === 404}
		<p>The resource you're looking for doesn't exist.</p>
	{:else if status === 408}
		<p>Request timeout. Please check your internet connection and try again.</p>
	{:else if status === 409}
		<p>Conflict detected. The resource might already exist or has been modified.</p>
	{:else if status === 429}
		<p>Too many requests. Please slow down and try again later.</p>
	{:else if status >= 500 && status < 600}
		<p>Server error. We're experiencing technical difficulties. Please try again later.</p>
	{:else}
		<p>An unexpected error occurred. Please try again or contact support.</p>
	{/if}

	<a href="/" class="home-button">Go Home</a>
</div>

<style>
	.error-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #fff5f5;
		color: #4a1c1c;
		text-align: center;
		padding: 2rem;
		box-sizing: border-box;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	.title {
		font-size: 3.5rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		font-size: 1.5rem;
		margin-bottom: 2rem;
		color: #822727;
	}

	.status-box {
		margin-bottom: 1rem;
	}

	.status-box h2 {
		font-size: 2.5rem;
		margin: 0;
	}

	.status-box p {
		font-size: 1.1rem;
		margin: 0.5rem 0 1.5rem;
		color: #6b2d2d;
	}

	a {
		color: #b91c1c;
		text-decoration: underline;
	}

	.home-button {
		margin-top: 2rem;
		background-color: #b91c1c;
		color: white;
		padding: 0.6rem 1.2rem;
		border: none;
		border-radius: 5px;
		text-decoration: none;
		font-size: 1rem;
		cursor: pointer;
		transition: background-color 0.2s ease;
	}

	.home-button:hover {
		background-color: #7f1d1d;
	}
</style>
