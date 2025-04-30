<script lang="ts">
  import { z } from "zod";
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";
  export let form: any;

  import { goto } from "$app/navigation";
  import { login } from "$lib/api/auth";
  import { authStore } from "$lib/stores/authStore";

  const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
  });

  const formData = writable({
    email: "username1@xyz.com",
    password: "password1",
    error: "",
    isLoading: false,
  });

  const formErrors = writable<{ email?: string; password?: string }>({});

  async function validate(): Promise<boolean> {
    const $formData = get(formData);
    const result = loginSchema.safeParse($formData);

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

  //   async function handleSubmit(event: Event) {
  //     event.preventDefault();

  //     // Get current form data
  //     const $formData = get(formData);
  //     formData.update((f) => ({ ...f, isLoading: true, error: "" }));

  //     const isValid = await validate();
  //     if (isValid) {
  //       try {
  //         const data: any = await login({
  //           email: $formData.email,
  //           password: $formData.password,
  //         });
  //         if (data.success) {
  //           const { token, user } = data.data;
  //           authStore.login(token, user);
  //           goto(`/dashboard/${user.role}`);
  //         }
  //       } catch (err: any) {
  //         formData.update((f) => ({
  //           ...f,
  //           error: err.message || "Invalid credentials",
  //         }));
  //       } finally {
  //         formData.update((f) => ({ ...f, isLoading: false }));
  //       }
  //     } else {
  //       formData.update((f) => ({ ...f, isLoading: false }));
  //     }
  //   }

  function handleBlur(field: keyof typeof $formData) {
    // Optional: track touched fields for validation UX
  }

  function handleChange(field: keyof typeof $formData, value: string) {
    formData.update((f) => {
      return {
        ...f,
        [field]: value,
      };
    });
  }
</script>

<div class="main-card">
  <div class="login-card">
    <!-- <img src="https://via.placeholder.com/40" alt="School Logo" /> -->
    <h2>School Logo</h2>
    <h3>Login to Your Account</h3>
    <p>Enter your credentials below</p>
    <form method="POST">
      <div class="input-wrapper">
        <input name="email"
          type="email"
          value="username1@xyz.com"
          placeholder="Enter your email"
        />
      </div>
      <div class="input-wrapper">
        <input name="password"
          id="password"
          type="password"
          value="password1"
          placeholder="Enter your password"
        />
      </div>

      <div class="forgot-password">
        <a href="forgot-password">Forgot password?</a>
      </div>
      <button type="submit">Login</button>
    </form>
    <div class="signup">
      Don't have an account? <a href="/sign-up">Sign up</a>
    </div>
    {#if form?.error}
      <p style="color: red;">{form.error}</p>
    {/if}
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
