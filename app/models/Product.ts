import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  productName: string;
  price: string;
  image: string;
  productDescription: string;
  department: string;
  id: string;
}

const ProductSchema: Schema = new Schema({
  productName: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  productDescription: { type: String, required: true },
  department: { type: String, required: true },
  id: { type: String, required: true }
});

export const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
