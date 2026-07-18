<script lang="ts">
	import "$lib/style.css";
	
	let { children } = $props();
</script>

<svelte:head>
	<title>CIRCUIT VIS DATA ANALYSIS</title>
</svelte:head>

{@render children()}
