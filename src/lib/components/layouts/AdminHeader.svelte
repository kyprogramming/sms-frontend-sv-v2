<script lang="ts">
    import { goto } from "$app/navigation";
  import type { User } from "$lib/types/types";
  export let user: User | null;
  function handleLogout() {
    window.location.href = "/logout";
  }

  async function onSubmit(event: Event) {
    event.preventDefault();
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json"},
        credentials: "include",
      });
      const response = await res.json();
    //   console.log("REsponse:", response);
      if (response.success) {
        goto('/');
      }
    } catch (err: any) {
    } finally {
    }
  }
</script>

<header class="header">
  <!-- <div class="header_logo">
    <a href="/">SCHOOL MANAGEMENT</a>
  </div> -->
  <div class="logo">
		<h1>School<span>Management System</span></h1>
	</div>
  {#if user?.authenticated}
    <div class="user-profile">
      <div class="profile-img">{user.name?.charAt(0).toUpperCase()}</div>
      <div class="user-info">
        <div class="user-name">{user.name.toUpperCase()}</div>
        <div class="user-role">
          {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
        </div>
      </div>
      <div>
        <form on:submit={onSubmit}>
          <button class="logout-button" type="submit">Logout</button>
        </form>
      </div>
    </div>
  {/if}
</header>

<style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 15px;
    box-shadow: var(--shadow-sm);
  }
  .header_logo {
    display: flex;
    align-items: center;
    margin-left: 0.5rem;
  }
  .header_logo a {
    color: #000;
    font-size: 1.3rem;
    font-weight: 700;
    text-decoration: none;
    text-transform: uppercase;
  }
 
  .user-profile {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: var(--radius);
    transition: var(--transition);
    margin-left: 10px;
  }

  .user-profile:hover {
    background-color: rgba(67, 97, 238, 0.11);
  }

  .profile-img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--secondary), var(--primary));
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    margin-right: 12px;
    box-shadow: 0 3px 8px rgba(67, 97, 238, 0.2);
    font-size: 16px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
  }

  .user-name {
    font-weight: 600;
    font-size: 14px;
  }

  .user-role {
    font-size: 12px;
    color: var(--text-light);
  }

  .logout-button {
    background-color: #d60f0f; /* red-500 */
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease;
    margin-left: 15px;
  }

  .logout-button:hover {
    background-color: #dc2626; /* red-600 */
  }

  .logout-button:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5); /* red-500/50 */
  }

  .logo {
		padding: 24px 20px;
		text-align: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		margin-bottom: 10px;
	}

	.logo h1 {
		font-size: 26px;
		font-weight: 700;
		color: var(--primary-light);
		display: flex;
		align-items: center;
		justify-content: center;
		letter-spacing: 0.5px;
	}

	.logo span {
		color: var(--primary-light);
		background: linear-gradient(45deg, var(--primary-light), var(--success));
		-webkit-background-clip: text;
		background-clip: text;
		-webkit-text-fill-color: transparent;
		margin-left: 4px;
	}
</style>

<!-- 
 .menu_list a {
    margin: 2rem;
    font-weight: 500;
    color: rgb(87, 86, 86);
    text-decoration: none;
  }
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
