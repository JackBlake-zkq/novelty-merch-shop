export interface ShopItem {

    /**
     * The stripe price id for the item: obtained from the stripe price object
     */
    price: string;


    /**
     * The cost of pbuying one of this product: obtained from the unit_amount of the stripe price object
     */
    cost: number;

    /**
     * Prodigi Mockup img for this item: obtained from the from the stripe product object's images field
     */
    mockup: string;

    /**
     * Name of the product: obtained from the name field of the stripe product object
     */
    name: string;
}
