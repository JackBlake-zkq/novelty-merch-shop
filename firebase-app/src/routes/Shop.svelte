<script>
    import { functions } from '../firebase';
    import { httpsCallable } from "firebase/functions";
    import { loading, shopItems } from '../stores';
    import ProductCard from '../components/ProductCard.svelte';

    const getShopItems = httpsCallable(functions, 'getShopItems');

    if(!$shopItems) {
        loading.set(true);
        getShopItems()
            .then(res => {
                shopItems.set(res.data.shopItems);
            })
            .catch(err => {
                console.error(err);
                alert('Failed to load shop items! Please refresh the page. If the issue persists, please contact jblake8149@gmail.com');
            })
            .finally(() => loading.set(false));
    }
</script>

<main>
    {#if $shopItems}
        {#each $shopItems as shopItem}
            <ProductCard {shopItem}/>
        {/each}
    {/if}
</main>
