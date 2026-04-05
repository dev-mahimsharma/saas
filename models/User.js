import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional if signing in with OAuth
    },
    image: {
      type: String,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otpCode: {
      type: String,
      required: false,
    },
    otpExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);

export default User;
