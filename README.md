# McNally Fans

This WIP project implements backend that integrates several external APIs. The main logic of the application is dealt with in [Firebase Cloud Functions](https://firebase.google.com/docs/functions), and utilizes [Stipe's Javascript API](https://stripe.com/docs/js) and [Prodigi's RESTful Print API](https://www.prodigi.com/print-api/docs/reference/#introduction). The Cloud Functions send Stripe product data to users, create [stripe checkout](https://stripe.com/docs/payments/checkout) sessions, and listen to [stripe webhooks](https://stripe.com/docs/webhooks) to place orders by making requests to Prodigi's API with [Axios](https://axios-http.com/docs/intro).  The frontend for this web app is a [Svelte](https://svelte.dev/) single page app, built with [rollup](https://rollupjs.org/guide/en/), and deployed to [Firebase Hosting](https://firebase.google.com/docs/hosting).

## Development

To run in development, first the following environment variables must be defined in a `.env` file inside the `/firebase-app/functions` directory:

```
STRIPE_PRIVATE_KEY
CLIENT_URL
STRIPE_SIGNING_SECRET
PRODIGI_API_KEY
```

These API come from the stripe dashboard (in test mode) and the Prodigi sandbox dashboard. The signing secret is used to verify that requests to the stripe webhook endpoint have the signature that ensures the requests were made by stripe. `CLIENT_URL` should be `http://localhost:5020`. Then, to run the application locally, from the `/firebase-app` directory, run:

```bash
npm run dev
```

This will start up Firebase Hosting and Functions emulators. You'll be able to view the application at `http://localhost:5020` and the functions will be hosted at `http://localhost:5021/mcnally-shop/us-central1`. Unfortunatly, the application will not automatically rebuild everytime you save, as this is not something supported by the Hosting emulator or the Functions emulator when using Typescript.

To get stripe's webhooks to work locally, in another terminal window, you can run: 
```bash
stripe listen --forward-to http://localhost:5021/mcnally-shop/us-central1/stripeHooks
```

## Deployment

First, swap out the API Key environement variables for the Functions with their production counterparts, and change `CLIENT_URL` to `https://mcnally.fans`. Then, in `/firebase-app`, run:
```bash
npm run build:prod
```
This will tell rollup to build the application to not use emulators for Firebase Functions. Finally, in `/firebase-app`, run:
```bash
firebase deploy
```

## Future

This project currently lacks the ability to notify users about their orders' statuses. To implement this, I may use [Prodigi Callbacks](https://www.prodigi.com/print-api/docs/reference/#callbacks-properties), or I'll switch to a different print to demand service that integrates more seemlessly with stripe.

