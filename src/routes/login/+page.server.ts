import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");
  if (token) {
    throw redirect(302, "/dashboard/admin");
  }
};

export const actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return fail(400, { error: "Missing credentials" });
    }

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      return fail(res.status, { error: data.message || "Login failed" });
    }

    const data = await res.json();
    cookies.set("token", data.data.token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Set to true in production
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Redirect to the admin dashboard after successful login
    throw redirect(302, "/dashboard/admin");
  },
};
