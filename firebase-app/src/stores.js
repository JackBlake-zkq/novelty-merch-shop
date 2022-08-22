import { writable } from "svelte/store";

export const shopItems = writable(null);

export const cart = writable([]);