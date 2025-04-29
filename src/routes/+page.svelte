<script lang="ts">
    import Carousel from "$lib/components/Carousel.svelte";
    import bg_1 from "$lib/assets/images/bg_1.jpg";
    import bg_2 from "$lib/assets/images/bg_2.jpg";
    import bg_3 from "$lib/assets/images/bg_3.jpg";
    import bg_4 from "$lib/assets/images/bg_4.jpg";

    //   const images = [
    //     'https://picsum.photos/id/1018/1200/400',
    //     'https://picsum.photos/id/1020/1200/400',
    //     'https://picsum.photos/id/1033/1200/400'
    //   ]
    const images = [bg_1, bg_2, bg_3, bg_4];
</script>

<Carousel {images} />
<h2 class="text-2xl font-bold mb-4">Welcome to Dashboard</h2>
<p>This is the main content area of the dashboard.</p>
