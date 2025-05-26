// import { json, redirect } from "@sveltejs/kit";
// import { COOKIE_OPTIONS } from "$lib/constants";

// export async function POST({ request, cookies }) {
//   const body = await request.json();
//   const { email, password } = body;

//   // 🔐 Simulate authentication (replace with real DB call)
//   const user = authenticateUser(email, password);
//   if (!user) {
//     return json({ error: "Invalid credentials" }, { status: 400 });
//   }

//   const token = generateToken(user); // Replace with real JWT generation

//   // ✅ Set cookies
//   cookies.set("token", token, COOKIE_OPTIONS);
//   cookies.set("user", JSON.stringify(user), {
//     ...COOKIE_OPTIONS,
//     httpOnly: false, // Safe to make accessible via JS
//   });

//   // Redirect or respond successfully
//   throw redirect(303, `/dashboard/${user.role}`);
// }

// // Dummy functions - replace with your logic
// function authenticateUser(email: string, password: string) {
//   // e.g., fetch from DB
//   return { id: "1", email, role: "admin" };
// }
// function generateToken(user: any) {
//   return "dummy-jwt-token"; // Replace with real JWT
// }
