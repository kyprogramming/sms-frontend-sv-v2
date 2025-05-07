<script lang="ts">
	import Breadcrumb from "$lib/components/Breadcrumb.svelte";
	import SectionList from "./SectionList.svelte";

    	const breadcrumbItems = [
		{ label: "Home", href: "/" },
		{ label: "Dashboard", href: "/dashboard/admin" },
		{ label: "Sections" },
	];

    export let data: {
		sections: { _id: string; name: string; createdAt:string;}[];
	};
	let { sections } = data;

</script>
<Breadcrumb title="Sections" items={breadcrumbItems} />
<SectionList {sections} />
