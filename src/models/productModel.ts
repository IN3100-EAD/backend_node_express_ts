import mongoose from "mongoose";

//  Products Collection: This will store information about all the items in the inventory. Fields can include productId, productName, productDescription, price, quantityAvailable, etc.

interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  mainImage: string;
  additionalImages: string[];
  isListed: boolean;
  listedBy: mongoose.Schema.Types.ObjectId;
}

interface TypedProduct {
  TypedProduct: mongoose.Document<IProduct>;
}

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
    },
    mainImage: {
      type: String,
      required: [true, "Main image is required"],
    },
    additionalImages: {
      type: [String],
      default: [],
    },
    isListed: {
      type: Boolean,
      default: true,
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ProductModel = mongoose.model<IProduct>(
  "Product",
  productSchema
);

export { IProduct, ProductModel, TypedProduct };
