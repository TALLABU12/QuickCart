import types from "@eslint/eslintrc/lib/shared/types";
import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";
import { trace } from "next/dist/trace";
import { Moo_Lah_Lah } from "next/font/google";
import { use } from "react";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    ImageUrl: { type: String, required: true },
    cartItems: { type: Object, default: {} },
  },
  { minimize: false }
);

const user = mongoose.model.user || mongoose.model("user", userSchema);

export default user;
