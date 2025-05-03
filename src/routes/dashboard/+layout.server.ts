// // src/routes/+layout.server.ts
// // import { authStore } from "$lib/stores/authStore";
// import type { LayoutServerLoad } from "./$types";

// export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
//   console.log("LAYOUT LOAD CALLED");

//   try {
//     const token = cookies.get("auth_token"); // Get your cookie

//     if (!token) {
//       console.log("No token found");
//       return {};
//     }

//     // Make request to your own backend API endpoint
//     const response = await fetch("http://localhost:5000/api/auth/me", {
//       method: "GET",
//       headers: {
//         Cookie: `auth_token=${token}`, // Manually attach cookie for external APIs
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch user");
//     }

//     const user = await response.json();

//     // Update store with user data (if needed)
//     // authStore.login(user, token);

//     return {
//       props: {
//         user,
//       },
//     };
//   } catch (err) {
//     console.error("Auth check failed:", err);
//     return {};
//   }
// };
