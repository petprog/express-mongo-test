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
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to update updated_at field
UserSchema.pre("save", function (next) {
  this.updated_at = new Date();
  next();
});

export const User = mongoose.model("User", UserSchema);
