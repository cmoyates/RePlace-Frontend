<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { io } from 'socket.io-client';
	import { socket } from '../stores';
	import { getMousePos, setPixel } from '../utils';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';

	const COLORS: string[] = [
		'#ff0000',
		'#ffff00',
		'#00ff00',
		'#00ffff',
		'#0000ff',
		'#ff00ff',
		'#ffffff',
		'#000000'
	];

	// Canvas related variables
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;

	let currentColor: string = '#000000';

	onMount(() => {
		canvas = document.getElementById('pixel-canvas') as HTMLCanvasElement;
		ctx = canvas.getContext('2d');

		$socket = io(PUBLIC_BACKEND_URL);

		$socket?.on('connect', () => {
			console.log('Connected!');
		});

		$socket?.on('init', (initialGrid: string[][]) => {
			if (!ctx) return;
			const width = initialGrid.length;
			const height = initialGrid[0].length;
			let pos = { x: 0, y: 0 };
			for (let i = 0; i < width; i++) {
				pos.x = i;
				for (let j = 0; j < height; j++) {
					pos.y = j;
					setPixel(pos, initialGrid[i][j], ctx);
				}
			}
		});

		$socket?.on('pixel-placed', (pos: { x: number; y: number }, color: string) => {
			if (!ctx) return;
			setPixel(pos, color, ctx);
		});
	});

	const placePixel = (e: any) => {
		const pos = getMousePos(canvas, e as PointerEvent);
		if (ctx) {
			setPixel(pos, currentColor, ctx);
		}
		console.log('place', pos);
		$socket?.emit('place-pixel', pos, currentColor);
	};

	onDestroy(() => {
		$socket?.disconnect();
	});
</script>

<main class="flex min-h-screen min-w-[1048px] flex-col items-center justify-center">
	<h1 class="text-[64px] font-thin leading-none">
		RE/<span class="text-red-500">PLACE</span>
	</h1>
	<p class="mb-6">
		A remake of <a
			class="text-red-500 underline-offset-1 hover:underline"
			href="https://www.reddit.com/r/place/">r/Place</a
		>
	</p>
	<div class="mb-[18px] flex">
		<div class="flex flex-col items-center justify-center space-y-4 p-4">
			{#each COLORS as color}
				<div class="flex">
					<!-- svelte-ignore a11y-role-supports-aria-props -->
					<button
						on:click={() => {
							console.log('Set current color to:', color);
							currentColor = color;
						}}
						class="
              h-8
              w-8
              border
              border-black/30
              opacity-30
              transition-opacity
              duration-200
              hover:opacity-100
              aria-selected:z-10
              aria-selected:-my-0.5
              aria-selected:h-9
              aria-selected:w-9
              aria-selected:border-black
              aria-selected:opacity-100
              aria-selected:shadow-lg
            "
						style={`background-color: ${color}`}
						aria-selected={currentColor === color}
					/>
				</div>
			{/each}
		</div>
		<canvas
			id="pixel-canvas"
			class="mr-[18px] border-2 border-black"
			width="960"
			height="540"
			on:click={placePixel}
		/>
	</div>
</main>
