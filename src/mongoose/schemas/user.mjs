import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      default: "email",
    },
    provider_id: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

export const User = mongoose.model("User", UserSchema);
