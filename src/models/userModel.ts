import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    authentication: {
      password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [
          8,
          "Password must be at least 8 characters",
        ],
        select: false,
      },
      salt: {
        type: String,
        select: false,
      },
      sessionToken: {
        type: String,
        select: false,
      },
    },
    role: {
      type: String,
      enum: [
        "customer",
        "inventoryManager",
        "deliveryPerson",
      ],
      default: "customer",
    },
    address: {
      addressLine1: {
        type: String,
      },
      addressLine2: {
        type: String,
      },
      city: {
        type: String,
      },
      zipCode: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export const UserModal = mongoose.model("User", UserSchema);
