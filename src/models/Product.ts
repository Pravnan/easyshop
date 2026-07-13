import mongoose, { Schema, Document } from "mongoose";

interface IProductImage {
  url: string;
  publicId: string;
}

interface IVariantGroup {
  name: string;
  options: string[];
}

export interface IProduct extends Document {
  storeId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  regularPrice: number;
  offerPrice?: number;
  productCode?: string;
  images: IProductImage[];
  colors: string[];
  sizes: string[];
  variantGroups: IVariantGroup[];
  inStock: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 200,
    },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    regularPrice: { type: Number, required: true, min: 0 },
    offerPrice: { type: Number, min: 0 },
    productCode: { type: String, trim: true, maxlength: 100 },
    images: {
      type: [
        {
          url: { type: String, required: true },
          publicId: { type: String, required: true },
        },
      ],
      validate: {
        validator: (arr: IProductImage[]) => arr.length <= 2,
        message: "Maximum 2 images allowed",
      },
    },
    colors: [{ type: String, trim: true, maxlength: 50 }],
    sizes: [{ type: String, trim: true, maxlength: 50 }],
    variantGroups: [
      {
        name: { type: String, required: true, trim: true, maxlength: 100 },
        options: [{ type: String, trim: true, maxlength: 100 }],
      },
    ],
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ProductSchema.index({ storeId: 1, slug: 1 }, { unique: true });
ProductSchema.index({ storeId: 1, categoryId: 1 });

export const Product =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);
