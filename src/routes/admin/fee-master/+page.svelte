<script lang="ts">
    import Breadcrumb from '$lib/components/common/Breadcrumb.svelte';
    import FeeMasterList from './FeeMasterList.svelte';
  
    let { data } = $props();
    let response = $state(data.data);
  
    const breadcrumbItems = [
      { label: 'Dashboard', href: '/admin/dashboard' },
      { label: 'Fee Collection' },
      { label: 'Fee Masters' }
    ];
  </script>
  
  <Breadcrumb title="Fee Master List" items={breadcrumbItems} />
  
  <FeeMasterList {response} />