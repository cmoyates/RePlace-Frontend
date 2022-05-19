<script lang="ts">
	import { tweened } from "svelte/motion";
	import { cubicOut } from 'svelte/easing';

	let footerOpacity = tweened(0.05, {
		duration: 300,
		easing: cubicOut
	});

	export let colors: string[];
	export let currentColor: number;
</script>

<!-- Opacity controlled by the variable and changed on mouseover -->
<footer
	style="opacity:{$footerOpacity}"
	on:mouseenter={() => {footerOpacity.set(1)}}
	on:mouseleave={() => {footerOpacity.set(0.05)}}
>
	<!-- A button for each color from the constant array -->
	{#each colors as color, index}
		<div 
			class="colorButton" 
			style={"background-color:" + color}
			id={currentColor === index && "selected"}
			on:click={() => {currentColor = index}}
		/>
	{/each}
</footer>

<style>
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
</style>