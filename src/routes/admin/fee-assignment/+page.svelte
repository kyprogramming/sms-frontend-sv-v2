<script lang="ts">
    import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
	import FeeAssignmentList from './FeeAssignmentList.svelte';

  
    let { data } = $props();
    let response = $state(data.data);
  
    const breadcrumbItems = [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Fee Collection' },
      { label: 'Fee Assignment' }
    ];
</script>
  
<Breadcrumb title="Fee Assignment" items={breadcrumbItems} />

<FeeAssignmentList {response} />