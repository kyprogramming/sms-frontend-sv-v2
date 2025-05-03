import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
  const sessionToken = event.cookies.get("session_token");
//   console.log("sessionToken:", sessionToken);

  if (sessionToken) {
    const decoded = decodeJwt(sessionToken);
    // console.log("decoded:", decoded);
    event.locals.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
      authenticated: true,
    };
  }

  return await resolve(event);
};
function decodeJwt(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch {
    return null;
  }
}

// authStore.update((store) => {
//   const newStore = { ...store, decoded };
//   // Save to localStorage only in the browser
//   if (typeof window !== "undefined") {
//     localStorage.setItem("auth", JSON.stringify(newStore));
//   }
//   return newStore;
// });
