<script>
    export let cartItem = null;
</script>

{#if cartItem}
<main>
    <img src={cartItem.mockup} alt={cartItem.name}>
    <h2>{cartItem.name}</h2>
    <input type="number" min=0 bind:value={cartItem.quantity}>
    <p>${parseFloat(cartItem.cost.toString().slice(0, -2) + '.' + cartItem.cost.toString().slice(-2)) * cartItem.quantity}</p>
</main>
{/if}

<style>
    img {
        width: 4rem;
        height: 4rem;
    }
    main {
        box-shadow: 2px 2px black;
        background: white;
        border-radius: 1rem;
        width: 80%;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
    }
</style>