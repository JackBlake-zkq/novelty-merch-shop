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
            <span>
                {$cart.reduce( (num, b) => num + b.quantity, 0 )}
            </span>
        </div>
    </button>
    {/if}
    {#if $location != '/shop'}
    <button on:click={() => push('/shop')}>Shop</button>
    {/if}
    {#if $location != '/'}
    <button on:click={() => push('/')}>Home</button>
    {/if}
    
</nav>

<style>
    button div {
        height: 100%;
        width: 3rem;
        position: relative;
    }
    button div span {
        position: absolute;
        left: 1rem;
        top: 0.65rem;
        font-size: 1rem;
    }
    button {
        margin: 1rem;
        min-width: 3rem;
        height: 3rem;
        background: transparent;
        border: none;
        fill: black;
    }
    button:hover {
        color: rgb(48, 48, 48);
        fill: rgb(48, 48, 48);
    }
    nav {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background: lightgray;
        display: flex;
        justify-content: flex-end;
        z-index: 50;
    }
</style>