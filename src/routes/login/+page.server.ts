import { redirect, fail } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";
// import { authStore } from "$lib/stores/authStore";


export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get("token");
  if (token) {
    throw redirect(302, "/dashboard/admin");
  }
};

export const actions: Actions = {
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
    // console.log({ "data::": data });
    cookies.set("token", data.data.token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 60 * 60 * 24,
    });
    // authStore.login(data.data.user, data.data.token);
    throw redirect(302, "/dashboard/admin");
  },
};

//   logout: async ({ cookies }) => {
//     // await fetch("http://localhost:5000/api/auth/logout", {
//     //   method: "POST",
//     //   credentials: "include",
//     // });

//     cookies.delete("token", { path: "/" });
//     throw redirect(302, "/login");
//   },
