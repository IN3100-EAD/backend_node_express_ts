import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import validator from "validator";

interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  zipCode?: string;
}

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  confirmPassword: string | undefined;
  phoneNumber: string;
  role: "customer" | "inventoryManager" | "deliveryPerson";
  address: Address;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
  createPasswordResetToken: () => string;
}

export interface TypedUser {
  TypedUser: mongoose.Document<IUser>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        "Valid email is required",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [
        8,
        "Password must be at least 8 characters",
      ],
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "Confirm password is required"],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (this: IUser, el: String) {
          return el === this.password;
        },
        message:
          "Password and confirm password are not the same",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: function (el: String) {
          return validator.isMobilePhone;
        },
        message: "Invalid phone number",
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
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//? PRE-MIDDLEWARE: runs before .save() and .create()

userSchema.pre(
  "save",
  async function (this: IUser, next: () => void) {
    //This function will run only if the password is modified
    if (!this.isModified("password")) return next();

    //Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
    //?cost parameter- Measure how cpu intensive this operation will be.

    //To remove passwordConfirm field from the database
    this.confirmPassword = undefined;

    //To move to the next middleware
    next();
  }
);

userSchema.pre(
  "save",
  function (this: IUser, next: () => void) {
    if (!this.isModified("password") || this.isNew)
      return next();

    this.passwordChangedAt = new Date(Date.now() - 1000);
    //Add a delay to get database the database

    next();
  }
);

// ? INSTANCE METHODS: methods that are available on all instances of the model

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function (
  this: IUser
): string {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(
    Date.now() + 10 * 60 * 1000
  ); //10 minutes

  return resetToken;
};

export const UserModel = mongoose.model<IUser>(
  "User",
  userSchema
);
