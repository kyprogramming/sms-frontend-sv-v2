import type { User } from "$lib/types/types";
declare global {
  namespace App {
   interface Locals {
     user?: User | null;
   }

    // You can also add other custom types here like:
    // interface Session {}
    // interface Platform {}
  }
}

export {};
