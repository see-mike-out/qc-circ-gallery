<script lang="ts">
	import "$lib/style.css";
	
	let { children } = $props();
</script>

<svelte:head>
	<title>Quantum Circuit Visualization Gallery</title>
</svelte:head>

{@render children()}
