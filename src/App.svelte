<script lang="ts">
	import { onMount } from 'svelte';
	import { io, Socket } from "socket.io-client";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	const PIXEL_SIZE = 16;

	let socket: Socket = io("http://localhost:5000");

	socket.on("init", (grid) => {
		for (let x = 0; x < 40; x++) {
			for (let y = 0; y < 30; y++) {
				ctx.fillStyle = grid[x][y];
				ctx.fillRect( x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE );
			}
		}
	})
	
	onMount( async () => {
		canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
		ctx = canvas.getContext("2d");
	});

	// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
	function getMousePos(canvas, event, pixelSize) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: Math.floor((event.clientX - rect.left) / pixelSize),
			y: Math.floor((event.clientY - rect.top) / pixelSize)
		};
	}

	function placePixel(event) {
		let mousePos = getMousePos(canvas, event, PIXEL_SIZE);
		// https://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
		ctx.fillStyle = "#ff0000";
		ctx.fillRect( mousePos.x * PIXEL_SIZE, mousePos.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE );

		socket.emit("place-pixel", mousePos, "#ff0000");
	}
</script>

<main>
	<h1>RePlace</h1>
	<canvas 
		id="myCanvas" 
		width="640" 
		height="480"
		on:click={placePixel}
	></canvas>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	canvas {
		border: 1px;
		border-color: black;
		border-style: solid;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>