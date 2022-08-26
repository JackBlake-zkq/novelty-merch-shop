<script>
	import Router from 'svelte-spa-router'
import FullscreenLoader from './components/FullscreenLoader.svelte';
	import NavBar from './components/NavBar.svelte';
	import routes from './routes'
</script>

<main>
	<NavBar/>
	<div>
		<Router {routes}/>
	</div>
	<FullscreenLoader/>
</main>

<style>
	main {
		position: relative;
		width: 100%;
	}
	div {
		top: 5rem;
		position: absolute;
		width: 100%;
	}
</style>