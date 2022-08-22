<script>
    import { functions } from '../firebase';
    import { httpsCallable } from "firebase/functions";
    import { cart } from '../stores';
import CartItemCard from '../components/CartItemCard.svelte';

    const createCheckoutSession = httpsCallable(functions, 'createCheckoutSession');

    const checkout = () => {
        createCheckoutSession({ line_items: $cart.map( ({ price, quantity }) => ({ price, quantity })) })
            .then(res => { 
                window.location.href = res.data.url 
            })
            .catch(err => {
                console.error(err);
            })
    }
</script>

<main>
    <div>
        {#each $cart as cartItem}
            <CartItemCard {cartItem}/>
        {/each}
    </div>
    <button on:click={checkout}>Checkout</button>
</main>