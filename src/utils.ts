const PIXEL_SIZE = 15;

// https://stackoverflow.com/questions/4899799/whats-the-best-way-to-set-a-single-pixel-in-an-html5-canvas
export const setPixel = (
	pos: { x: number; y: number },
	color: string,
	ctx: CanvasRenderingContext2D
) => {
	ctx.fillStyle = color;
	ctx.fillRect(pos.x * PIXEL_SIZE, pos.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
};

// https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
export const getMousePos = (canvas: HTMLCanvasElement, event: PointerEvent) => {
	const rect = canvas.getBoundingClientRect();
	return {
		x: Math.floor((event.clientX - rect.left) / PIXEL_SIZE),
		y: Math.floor((event.clientY - rect.top) / PIXEL_SIZE)
	};
};
