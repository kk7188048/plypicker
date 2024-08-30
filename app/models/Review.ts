import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  id: string;
  changes: {
    productName?: string;
    price?: string;
    image?: string;
    productDescription?: string;
    department?: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  author: string; // user ID
  adminId?: string; // admin ID
}

const ReviewSchema: Schema = new Schema({
  id: { type: String, required: true },
  changes: {
    productName: { type: String },
    price: { type: String },
    image: { type: String },
    productDescription: { type: String },
    department: { type: String },
  },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  author: { type: String, required: true },
  adminId: { type: String },
});

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
