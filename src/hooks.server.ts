// src/hooks.server.ts
import type { Handle } from "@sveltejs/kit";

// export const handle: Handle = async ({ event, resolve }) => {
//   const token = event.cookies.get("token");

//   if (token) {
//     try {
//       const res = await fetch("http://localhost:5000/api/auth/verify", {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (res.ok) {
//         const { user } = await res.json();
//         event.locals.user = user;
//       } else {
//           event.locals.user = null;
//           event.cookies.delete("token", {
//             path: "/",
//             httpOnly: true,
//             sameSite: "lax",
//             secure: false,
//             maxAge: 60 * 60 * 24,
//           });
//       }
//     } catch {
//         event.locals.user = null;
//     }
//   } else {
//       event.locals.user = null;
//   }

//   return resolve(event);
// };
