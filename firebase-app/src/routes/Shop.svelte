<script>
    import { functions } from '../firebase';
    import { httpsCallable } from "firebase/functions";
    import { shopItems } from '../stores';
    import ProductCard from '../components/ProductCard.svelte';

    const getShopItems = httpsCallable(functions, 'getShopItems');

    getShopItems()
        .then(res => {
            shopItems.set(res.data.shopItems);
        })
        .catch(err => {
            console.error(err);
            alert('Failed to load shop items! Please refresh the page. If the issue persists, please contact jblake8149@gmail.com');
        });
</script>

<main>
    {#if $shopItems}
        {#each $shopItems as shopItem}
            <ProductCard {shopItem}/>
        {/each}
    {/if}
</main>
