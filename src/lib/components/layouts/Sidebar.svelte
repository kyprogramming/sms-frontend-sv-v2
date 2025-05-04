<script lang="ts">
	const menuItems = [
		{ label: "Dashboard", link: "/dashboard" },
		{ label: "Students", link: "/students" },
		{ label: "Teachers", link: "/teachers" },
		{ label: "Classes", link: "/classes" },
		{ label: "Settings", link: "/settings" },
	];
</script>

<aside class="w-64 bg-gray-800 text-white min-h-[calc(100vh-116px)] p-4">
	<ul class="space-y-2">
		{#each menuItems as item}
			<li>
				<a
					href={item.link}
					class="block py-2 px-3 rounded hover:bg-gray-700 transition"
				>
					{item.label}
				</a>
			</li>
		{/each}
	</ul>
</aside>
