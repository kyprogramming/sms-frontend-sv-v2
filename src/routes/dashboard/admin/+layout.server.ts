import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
   const user = locals.user;
   if (!user || user.role !== "admin") {
     throw redirect(302, "/unauthorized");
   }
   return {
     user: locals.user || null,
   };
};
