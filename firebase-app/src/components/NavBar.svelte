<script>
    import { cart } from '../stores';
    import { location, push } from 'svelte-spa-router'
    import CartIcon from './icons/CartIcon.svelte';
</script>

<nav>
    {#if $location != '/cart'}
    <button on:click={() => push('/cart')}>
        <div>
            <CartIcon/>
        </div>
        {$cart.reduce( (num, b) => num + b.quantity, 0 )}
    </button>
    {/if}
    {#if $location != '/'}
    <button on:click={() => push('/')}>Shop</button>
    {/if}
</nav>

<style>
    button div {
        fill: black;
        width: 3rem;
        height: 3rem;
    }
</style>