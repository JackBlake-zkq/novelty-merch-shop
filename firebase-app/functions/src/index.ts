const prod = process.env['NODE_ENV'] === 'production';

//Firebase functions autimatically load in environment variables from .env files
if(!prod) require('dotenv').config();

const { STRIPE_PRIVATE_KEY, CLIENT_URL, STRIPE_SIGNING_SECRET, PRODIGI_API_KEY } = process.env;
if(!STRIPE_PRIVATE_KEY || !CLIENT_URL || !STRIPE_SIGNING_SECRET || !PRODIGI_API_KEY) 
    throw new Error('Aborted: Not all necessary environment variables have been provided');

import Stripe from 'stripe';
const stripe = new Stripe(STRIPE_PRIVATE_KEY, {
    apiVersion: '2020-08-27'
});

let prodigiBaseURL = 'https://api.sandbox.prodigi.com';
if(prod) prodigiBaseURL = 'https://api.prodigi.com';
import axios from 'axios';
const prodigi = axios.create({
    baseURL: prodigiBaseURL,
    headers: {
        'X-API-Key': PRODIGI_API_KEY,
        'Content-Type': 'application/json'
    }
})

import * as functions from "firebase-functions";
import { ShopItem } from './TypeDefs';


exports.getShopItems = functions.https.onCall( async (data, context) => {
    try {
        const products = (await stripe.products.list()).data;
        const prices = (await stripe.prices.list()).data;
        const shopItems: ShopItem[] = [];
        products.forEach(product => {
            const price = prices.find(price => price.product == product.id);
            if(!price?.id || !price?.unit_amount) throw new Error('Price object does not have an id or unit-amount');
            shopItems.push({
                name: product.name,
                mockup: product.images[0],
                price: price?.id,
                cost: price?.unit_amount
            })
        })
        return { shopItems };
    } catch(err) {
        console.error(err);
        throw new functions.https.HttpsError('internal', 'failed to retrieve products');
    }
})

exports.createCheckoutSession = functions.https.onCall( async (data, context) => {
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = data.line_items;
    console.log(line_items)
    try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          line_items,
          success_url: `${CLIENT_URL}/#/success`,
          cancel_url: `${CLIENT_URL}/#/cancel`,
          shipping_address_collection: {
            allowed_countries: ['US'],
          }
        })
        return { url: session.url };
      } catch (err) {
        console.error(err);
        throw new functions.https.HttpsError('internal', 'Failed to create checkout session');
    }
});

exports.stripeHooks = functions.https.onRequest( async (req, res) => {
  try {
    const sig = req.headers['stripe-signature'] || '';
    const event = stripe.webhooks.constructEvent(req['rawBody'], sig, STRIPE_SIGNING_SECRET);
    if(event.type == 'payment_intent.succeeded') {
        console.log('Succesful payment webhook fired')
        const intent = event.data.object as Stripe.PaymentIntent;
        const orderBody = await getProdigiOrderBodyFromStripePaymentIntent(intent);
        await prodigi.post('/v4.0/Orders', orderBody);
        res.sendStatus(200);
        return;
    }
    res.sendStatus(403);
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
});

async function getProdigiOrderBodyFromStripePaymentIntent(intent: Stripe.PaymentIntent) {
    const sessions = (await stripe.checkout.sessions.list({ payment_intent: intent.id })).data;
    if(sessions.length < 1) throw new Error('No checkout session corresponds with this payment intent!');
    if(sessions.length > 1) throw new Error('More than one checkout session exists for this payment intent!');
    const { id: sessionId } = sessions[0];
    const line_items = (await stripe.checkout.sessions.listLineItems(sessionId)).data;
    const products = (await stripe.products.list()).data;
    const productIdToProduct = new Map<string, Stripe.Product>();
    products.forEach(product => productIdToProduct.set(product.id, product));
    const items = line_items.map(line_item => {
        const product = productIdToProduct.get(line_item.price?.product as string)
        if(product)
            return {
                sku: product.metadata.prodigi_sku,
                copies: line_item.quantity,
                sizing: 'fitPrintArea',
                assets: [
                    {
                        "printArea": "default",
                        "url": product.metadata.prodigi_image
                    }
                ]
            }
        else throw new Error('One of the products with the given id was not found!');
    });
    const name =  intent.shipping?.name;
    const email = intent.receipt_email;
    const { line1, line2, postal_code: postalOrZipCode, city: townOrCity, state: stateOrCounty, country: countryCode } = intent.shipping?.address || {};
    const address = { line1, line2, postalOrZipCode, townOrCity, stateOrCounty, countryCode };
    const idempotencyKey = intent.id;
    return {
        shippingMethod: "Budget",
        recipient: {
            address,
            name,
            email
        },
        items,
        idempotencyKey
    }
}

