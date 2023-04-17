import { writable } from 'svelte/store';
import type { Socket } from 'socket.io-client';

export const socket = writable<Socket>();
