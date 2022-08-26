import Shop from './routes/Shop.svelte';
import Success from './routes/Success.svelte';
import Failure from './routes/Failure.svelte';
import Cart from './routes/Cart.svelte';
import Cancel from './routes/Cancel.svelte';
import Home from './routes/Home.svelte';

export default {
    '/': Home,
    '/shop': Shop,
    '/success': Success,
    '/failure': Failure,
    '/cart': Cart,
    '/cancel': Cancel
}