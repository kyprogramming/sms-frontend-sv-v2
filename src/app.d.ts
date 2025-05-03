import type { User } from "$lib/types/index";
declare global {
  namespace App {
    // Interface for data added to event.locals (server side)
    interface Locals {
      user: User | null;
    }
  }
}

export {};
