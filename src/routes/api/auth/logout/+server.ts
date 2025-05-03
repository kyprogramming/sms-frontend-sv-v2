import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
    console.log("REQUEST -S - ", request);
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie");
     console.log("cookieHeader- ", cookieHeader);
    const res = await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader ? { cookie: cookieHeader } : {}),
      },
      credentials: "include",
    });

    console.log("Server Response", res);
    return new Response(res.body, {
        status: res.status,
        headers: res.headers,
    });
};

// import type { RequestHandler } from "./$types";

// export const POST: RequestHandler = async ({ request, fetch }) => {
//   const body = await request.json();
//   const cookieHeader = request.headers.get("cookie");
//   const res = await fetch("http://localhost:5000/api/auth/logout", {
//     method: "POST",
//     body: JSON.stringify(body),
//     headers: {
//       "Content-Type": "application/json",
//       ...(cookieHeader ? { cookie: cookieHeader } : {}),
//     },
//   });

//   return new Response(res.body, {
//     status: res.status,
//     headers: res.headers,
//   });
// };
