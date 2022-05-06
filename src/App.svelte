<script lang="ts">
	import { onMount } from 'svelte';
	import { io, Socket } from "socket.io-client";

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D;

	let loading: boolean = true;

	const PIXEL_SIZE: number = 20;
	const COLORS: string[] = [
		"#ff0000",
		"#ffff00",
		"#00ff00",
		"#00ffff",
		"#0000ff",
		"#ff00ff",
		"#ffffff",
		"#000000"
	]
	let currentColor: number = 0;

	let socket: Socket = io("http://localhost:5000");


	socket.on("init", (grid) => {
		for (let x = 0; x < 40; x++) {
			for (let y = 0; y < 30; y++) {
				ctx.fillStyle = grid[x][y];
				ctx.fillRect( x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE );
			}
		}
		loading = false;
	})

	socket.on("pixel-placed-by-user", (pos, color) => {
		setPixel(pos, color);
	});
	
	onMount( async () => {
		canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
		ctx = canvas.getContext("2d");
	});

	// https://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
	function setPixel(pos, color) {
		ctx.fillStyle = color;
		ctx.fillRect( pos.x * PIXEL_SIZE, pos.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE );
	}

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
		setPixel(mousePos, COLORS[currentColor]);

		socket.emit("place-pixel", mousePos, COLORS[currentColor]);
	}
</script>

<main>
	<h1>Re/<span class="place">Place</span></h1>
	<p>A remake of <a href="https://www.reddit.com/r/place/">r/Place</a></p>
	<canvas 
		id="myCanvas"
		class={loading ? "hide" : "show"}
		width="800" 
		height="600"
		on:click={placePixel}
	></canvas>
</main>
<footer>
	{#each COLORS as color, index}
		<div 
			class="colorButton" 
			style={"background-color:" + color}
			id={currentColor === index && "selected"}
			on:click={() => {currentColor = index}}
		/>
	{/each}
</footer>

<style>
	main {
		text-align: center;
		padding: 2em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
		margin-bottom: auto;
	}

	.place {
		color: #ff3e00;
	}

	.hide {
		display: none;
	}

	canvas {
		border: 1px;
		border-color: black;
		border-style: solid;
	}

	.colorButton {
		width: 3em;
		height: 3em;
		margin: 1em;
	}

	#selected {
		border: 4px;
		border-color: gray;
		border-style: solid;
	}

	footer {
		position: fixed;
		bottom: 0;
		background-color: #000000de;
		width: 100%;
		color: white;
		align-items: center;
		justify-content: center;
		display: flex;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>