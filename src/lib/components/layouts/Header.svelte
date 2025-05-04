<script lang="ts">
	import { goto } from "$app/navigation";
</script>

<header class="header">
	<div class="header_logo">
		<a href="/">SCHOOL MANAGEMENT</a>
	</div>
	<div class="menu_list">
		<a href="/" class="hover:underline">HOME</a>
		<a href="/about-us" class="hover:underline">ABOUT US</a>
		<a href="/faculty" class="hover:underline">FACULTY</a>
		<a href="/gallery" class="hover:underline">GALLERY</a>
		<a href="/contact-us" class="hover:underline">CONTACT US</a>
		<a href="/login" class="hover:underline">LOGIN</a>
	</div>
</header>
<!-- 

 .active {
    color: #000 !important;
    font-weight: 700 !important;
  }
  .profile {
    width: 170px;
    display: flex;
    cursor: pointer;
    align-items: center;
    border-radius: 120px;
    border: 1px solid rgb(209, 209, 209);
  }
  .profile img {
    width: 40px;
    position: relative;
    left: 8px;
    border-radius: 50%;
  }
  .profile h3 {
    margin: 0 15px;
    color: #b9068c;
  } -->

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 70px;
		padding: 15px;
		box-shadow: var(--shadow-sm);
	}
	.header_logo {
		display: flex;
		align-items: center;
		margin-left: 2rem;
	}
	.header_logo a {
		color: #000;
		font-size: 1.3rem;
		font-weight: 700;
		text-decoration: none;
		text-transform: uppercase;
	}
	.menu_list a {
		margin: 2rem;
		font-weight: 500;
		color: rgb(87, 86, 86);
		text-decoration: none;
	}
</style>
