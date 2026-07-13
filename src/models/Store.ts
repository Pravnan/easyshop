import mongoose, { Schema, Document } from "mongoose";

interface IImage {
  url: string;
  publicId: string;
}

export interface IStore extends Document {
  ownerId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  logo?: IImage;
  banner?: IImage;
  description?: string;
  whatsappNumber: string;
  phone?: string;
  email?: string;
  address?: string;
  deliveryInformation?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 100,
    },
    logo: {
      url: { type: String },
      publicId: { type: String },
    },
    banner: {
      url: { type: String },
      publicId: { type: String },
    },
    description: { type: String, trim: true, maxlength: 1000 },
    whatsappNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },
    phone: { type: String, trim: true, maxlength: 20 },
    email: { type: String, trim: true, maxlength: 255 },
    address: { type: String, trim: true, maxlength: 500 },
    deliveryInformation: { type: String, trim: true, maxlength: 1000 },
    facebookUrl: { type: String, trim: true, maxlength: 500 },
    instagramUrl: { type: String, trim: true, maxlength: 500 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Store = mongoose.models.Store ?? mongoose.model<IStore>("Store", StoreSchema);
