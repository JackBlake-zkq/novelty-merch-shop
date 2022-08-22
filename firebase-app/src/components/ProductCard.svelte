<script>
    import { cart } from '../stores';


    export let shopItem = null;

    function addToCart() {
        const itemIndex = $cart.findIndex(o => o.price == shopItem.price);
        if(itemIndex > -1) $cart[itemIndex].quantity++;
        else $cart[$cart.length] = { ...shopItem, quantity: 1 }
    }
</script>

{#if shopItem}
<main>
    <img src={shopItem.mockup} alt={shopItem.name}>
    <h2>{shopItem.name}</h2>
    <p>${shopItem.cost.toString().slice(0, -2) + '.' + shopItem.cost.toString().slice(-2)}</p>
    <button on:click={addToCart}>Add to Cart</button>
</main>
{/if}

<style>
    img {
        width: 16rem;
        height: 16rem;
    }
    main {
        box-shadow: 2px 2px black;
        background: white;
        border-radius: 1rem;
        width: fit-content;
        padding: 1rem;
        text-align: center;
    }
</style>