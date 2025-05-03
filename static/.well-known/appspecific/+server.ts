import { json } from "@sveltejs/kit";

export const GET = () => {
  return json({
    message: "No Chrome DevTools integration available",
  });
};
