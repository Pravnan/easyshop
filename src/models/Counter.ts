import mongoose, { Schema, Document } from "mongoose";

export interface ICounter extends Document {
  storeId: mongoose.Types.ObjectId;
  sequence: number;
}

const CounterSchema = new Schema<ICounter>({
  storeId: {
    type: Schema.Types.ObjectId,
    ref: "Store",
    required: true,
    unique: true,
  },
  sequence: { type: Number, default: 0 },
});

export const Counter =
  mongoose.models.Counter ?? mongoose.model<ICounter>("Counter", CounterSchema);
