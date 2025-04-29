<script lang="ts">
  import { z } from "zod";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { writable } from "svelte/store";

  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const formData = writable({
    email: "",
    password: "",
  });

  const formErrors = writable<{ email?: string; password?: string }>({});

  async function validate() {
    const values = await new Promise<typeof $formData>((resolve) => {
      const unsubscribe = formData.subscribe(resolve);
      unsubscribe();
    });

    const result = loginSchema.safeParse(values);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          errors[err.path[0]] = err.message;
        }
      });
      formErrors.set(errors);
      return false;
    } else {
      formErrors.set({});
      return true;
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const isValid = await validate();
    if (isValid) {
      alert("Form submitted!");
      // continue login API call
    }
  }

  function handleBlur(field: keyof typeof $formData) {
    // formTouched.update(t => ({ ...t, [field]: true }));
    // validateForm();
  }
</script>

<div class="main-card">
  <div class="login-card">
    <!-- <img src="https://via.placeholder.com/40" alt="School Logo" /> -->
    <h2>School Logo</h2>
    <h3>Login to Your Account</h3>
    <p>Enter your credentials below</p>
    <form on:submit|preventDefault={handleSubmit}>
      <div class="input-wrapper">
        <input
          type="email"
          placeholder="Enter your email"
          bind:value={$formData.email}
          on:blur={() => handleBlur("email")}
          class={$formErrors.email ? "" : ""}
        />
        {#if $formErrors.email}
          <span class="error-text">{$formErrors.email}</span>
        {/if}
      </div>
      <div class="input-wrapper">
        <input
          id="password"
          type="password"
          bind:value={$formData.password}
          on:blur={() => handleBlur("password")}
          class=" {$formErrors.password ? '' : ''}"
          placeholder="Enter your password"
        />
        {#if $formErrors.password}
          <span class="error-text">{$formErrors.password}</span>
        {/if}
      </div>

      <div class="forgot-password">
        <a href="forgot-password">Forgot password?</a>
      </div>
      <button type="submit">Login</button>
    </form>
    <div class="signup">
      Don't have an account? <a href="/sign-up">Sign up</a>
    </div>
  </div>
</div>

<!-- prettier-ignore -->
<style>
.main-card { display: flex; justify-content: center; align-items: center; height: calc(90vh); }
.login-card { background-color: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); width: 100%; max-width: 400px; text-align: center; }
/* .login-card img { width: 40px; height: 40px; margin-bottom: 10px; } */
.login-card h2 { margin: 0; font-size: 1.25rem; font-weight: 500; }
.login-card h3 { margin: 1rem 0 0.5rem; font-size: 1.5rem; font-weight: 700; color: #1f2937; }
.login-card p { margin-bottom: 1.5rem; color: var(--text); font-size: 0.9rem; }
.login-card input[type="email"], .login-card input[type="password"] { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 0.5rem; font-size: 1rem; }
.input-wrapper { margin-bottom: 0.75rem; }
.forgot-password { display: block; text-align: right; margin-bottom: 1rem; font-size: 0.875rem; }
.forgot-password a { color: #2563eb; text-decoration: none; }
.login-card button { background-color: #2563eb; color: white; border: none; padding: 0.75rem; width: 100%; border-radius: 0.5rem; font-size: 1rem; cursor: pointer; }
.signup { margin-top: 1rem; font-size: 0.875rem; }
.signup a { color: #2563eb; text-decoration: none; }
.error-text { color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem; display: block; text-align: left; }
</style>
