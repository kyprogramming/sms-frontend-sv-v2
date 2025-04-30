// // src/routes/dashboard/admin/+layout.server.ts
// import { redirect } from "@sveltejs/kit";
// import type { LayoutServerLoad } from "./$types";

// export const load: LayoutServerLoad = async ({ locals }) => {
//   if (!locals.user) {
//     // If no user is found in locals, redirect to login
//     throw redirect(302, "/login");
//   }

//   // Return user data if needed in the layout
//   return {
//     user: locals.user,
//   };
// };

import { redirect } from "@sveltejs/kit";

export const load = async ({ cookies }) => {
  const token = cookies.get("token");

  // Check if the token exists
  if (!token) {
    throw redirect(302, "/login");
  }

  // If needed, you can also verify the token's validity here, and redirect to login if invalid
  // (e.g., making an API call to your server to verify the token)

  return {}; // Proceed to the page if token is valid
};

