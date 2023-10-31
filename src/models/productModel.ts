import mongoose from "mongoose";

//  Products Collection: This will store information about all the items in the inventory. Fields can include productId, productName, productDescription, price, quantityAvailable, etc.

interface IProduct extends mongoose.Document {
  productName: string;
  productDescription: string;
  price: number;
  quantityAvailable: number;
  productImage: [
    {
      image_url: string;
      image_description: string;
    }
  ];
  isProductListed: boolean;
  listedBy: mongoose.Schema.Types.ObjectId;
}

interface TypedProduct {
  TypedProduct: mongoose.Document<IProduct>;
}

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
    },
    productDescription: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    quantityAvailable: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    productImage: [
      {
        image_url: {
          type: String,
        },
        image_description: {
          type: String,
        },
      },
    ],
    isProductListed: {
      type: Boolean,
      default: true,
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ProductModal = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export { IProduct, ProductModal, TypedProduct };
