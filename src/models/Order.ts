import mongoose, { Schema, Document } from "mongoose";

interface IOrderItem {
  productId?: mongoose.Types.ObjectId;
  productName: string;
  productImage?: string;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariants?: Record<string, string>;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface IOrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  note?: string;
}

export type OrderStatus = "NEW" | "CONTACTED" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
export type OrderSource = "WEBSITE" | "WHATSAPP" | "MANUAL";

export interface IOrder extends Document {
  storeId: mongoose.Types.ObjectId;
  orderId: string;
  externalOrderId?: string;
  customer: IOrderCustomer;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  source: OrderSource;
  status: OrderStatus;
  internalNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true },
    productImage: { type: String },
    selectedColor: { type: String },
    selectedSize: { type: String },
    selectedVariants: { type: Schema.Types.Mixed },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const OrderCustomerSchema = new Schema<IOrderCustomer>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, trim: true, maxlength: 255 },
    address: { type: String, required: true, trim: true, maxlength: 500 },
    city: { type: String, trim: true, maxlength: 100 },
    note: { type: String, trim: true, maxlength: 1000 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    orderId: { type: String, required: true, maxlength: 50 },
    externalOrderId: { type: String, trim: true, maxlength: 100 },
    customer: { type: OrderCustomerSchema, required: true },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    source: {
      type: String,
      enum: ["WEBSITE", "WHATSAPP", "MANUAL"],
      required: true,
    },
    status: {
      type: String,
      enum: ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "NEW",
    },
    internalNote: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

OrderSchema.index({ storeId: 1, orderId: 1 }, { unique: true });
OrderSchema.index({ storeId: 1, status: 1, createdAt: -1 });

export const Order =
  mongoose.models.Order ?? mongoose.model<IOrder>("Order", OrderSchema);
