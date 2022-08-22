import Shop from './routes/Shop.svelte';
import Success from './routes/Success.svelte';
import Failure from './routes/Failure.svelte';
import Cart from './routes/Cart.svelte'
import Cancel from './routes/Cancel.svelte'

export default {
    '/': Shop,
    '/success': Success,
    '/failure': Failure,
    '/cart': Cart,
    '/cancel': Cancel
}