import mongoose from "mongoose";

interface IOrder extends mongoose.Document {
  customerId: mongoose.Schema.Types.ObjectId;
  orderDetails: [
    {
      productId: mongoose.Schema.Types.ObjectId;
      quantity: number;
    }
  ];
  totalAmount: number;
}

interface TypedOrder {
  TypedOrder: mongoose.Document<IOrder>;
}

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Customer ID is required"],
    },
    orderDetails: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product ID is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
      },
    ],
    totalAmount: {
      type: Number,
    },
    paymentId: {
      type: String,
      required: [true, "Payment ID is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const orderModel = mongoose.model<IOrder>(
  "Order",
  orderSchema
);

export { orderModel, TypedOrder, IOrder };
