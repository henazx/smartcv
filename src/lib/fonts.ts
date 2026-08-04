"use client";

let registered = false;

export function ensureFontsRegistered() {
  if (registered) return;
  registered = true;
}
