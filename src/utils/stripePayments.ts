import Stripe from "stripe";

const stripeInstance = () => {
  if (!process.env.STRIPE_SECRET_KEY)
    throw new Error("STRIPE_SECRET_KEY not found");

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
  });
};

const createStripeProduct = async (
  productId: string,
  productName: string,
  productDescription: string,
  price: number,
  mainImage: string
) => {
  // CREATE STRIP INSTANCE
  const stripe = stripeInstance();

  // CREATE PRODUCT IN STRIPE
  await stripe.products.create({
    id: `prod_${productId}`,
    name: productName,
    description: productDescription,
    images: [mainImage],
  });

  // ADD PRICE TO THE PRODUCT
  await stripe.prices.create({
    product: `prod_${productId}`,
    unit_amount: price,
    currency: "lkr",
  });
};

// UPDATE PRICE OF A PRODUCT
const updateStripeProductPrice = async (
  productId: string,
  updatedPrice: number
) => {
  // CREATE STRIP INSTANCE
  const stripe = stripeInstance();

  // GET THE PRICE ID
  const price = await stripe.prices.list({
    product: `prod_${productId}`,
  });

  const activePrice = price.data.find(
    (price) => price.active === true
  );

  if (activePrice) {
    // SET THE PRODUCT TO INACTIVE
    await stripe.prices.update(activePrice.id, {
      active: false,
    });
  }

  // CREATE NEW PRICE OBJECT FOR UPDATED PRICE
  await stripe.prices.create({
    product: `prod_${productId}`,
    unit_amount: updatedPrice,
    currency: "lkr",
  });
};

export { createStripeProduct, updateStripeProductPrice };
