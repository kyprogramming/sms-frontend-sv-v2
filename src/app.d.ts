// src/app.d.ts
// This file is automatically picked up by SvelteKit

/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Locals {
    user: {
      id: string;
      role: string;
      [key: string]: any; // optional: allow more props
    } | null;
  }
}
