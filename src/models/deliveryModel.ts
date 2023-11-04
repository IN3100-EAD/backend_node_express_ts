import mongoose from "mongoose";

//Delivery Collection: This will store information about the deliveries. Fields can include deliveryId, orderId, deliveryPersonId, deliveryStatus (picked up, in transit, delivered), etc.

interface IDelivery extends mongoose.Document {
  orderId: mongoose.Schema.Types.ObjectId;
  deliveryPersonId: mongoose.Schema.Types.ObjectId;
  deliveryStatus:
    | "packaging"
    | "picked up"
    | "in transit"
    | "delivered"
    | "failed";
}

interface TypedDelivery {
  TypedDelivery: mongoose.Document<IDelivery>;
}

const deliverySchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
    deliveryPersonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryStatus: {
      type: String,
      enum: [
        "packaging",
        "picked up",
        "in transit",
        "delivered",
        "failed",
      ],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const DeliveryModel = mongoose.model<IDelivery>(
  "Delivery",
  deliverySchema
);

export { DeliveryModel, IDelivery, TypedDelivery };
