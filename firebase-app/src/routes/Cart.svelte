<script>
    import { functions } from '../firebase';
    import { httpsCallable } from "firebase/functions";
    import { cart, loading } from '../stores';
    import CartItemCard from '../components/CartItemCard.svelte';

    const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');

    const checkout = () => {
        loading.set(true);
        createCheckoutSession({ line_items: $cart.map( ({ price, quantity }) => ({ price, quantity })) })
            .then(res => { 
                window.location.href = res.data.url 
            })
            .catch(err => {
                console.error(err);
            })
            .finally(() => loading.set(false));
    }
</script>

<main>
    <div>
        {#if $cart.length}
            {#each $cart as cartItem, i}
            <div style="padding-left: 10%;">
                <CartItemCard {cartItem} on:remove={() => $cart = $cart.slice(0, i).concat($cart.slice(i + 1))}/>
            </div>
            {/each}
            <button on:click={checkout}>Checkout</button>
        {:else}
            <h1>There are no items in your cart!</h1>
        {/if}
    </div>
</main>

<style>
    h1 {
        text-align: center;
        margin: 4rem;
    }
    button {
        width: 100%;
        position: fixed;
        bottom: 0;
        left: 0;
        padding: 1rem;
    }
</style>