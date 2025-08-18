import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "../config/index.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // This ensures that the unique index ignores null values
    },
    walletId: {
      type: String,
      unique: true,
      sparse: true, // This ensures that the unique index ignores null values
    },
    password: {
      type: String,
      required: function() {
        return !this.isGoogleUser; // Only required if not a Google user
      },
      minlength: 8,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // This ensures that the unique index ignores null values
    },
    isGoogleUser: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password && !this.isGoogleUser) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  if (this.isGoogleUser) {
    return false; // Google users don't have passwords
  }
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      wallet: this.walletId,
    },
    config.jwt.accessTokenSecret,
    { expiresIn: config.jwt.accessTokenExpiry }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, config.jwt.refreshTokenSecret, {
    expiresIn: config.jwt.refreshTokenExpiry,
  });
};

export const User = mongoose.model("User", userSchema);
