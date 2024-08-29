import mongoose, { Schema, Document, CallbackError } from 'mongoose';
import bcryptjs from 'bcryptjs';

// Define User interface
export interface IUser extends Document {
  email: string;
  password: string;
  role: 'admin' | 'team member';
  comparePassword(enteredPassword: string): Promise<boolean>;
}

// Create User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    role: {
      type: String,
      enum: ['admin', 'team member'],
      default: 'team member',
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Hash password before saving the user document
UserSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  try {
    
    user.password = await bcryptjs.hash(user.password, 10)
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Add a method to compare entered password with hashed password
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
  return bcryptjs.compare(enteredPassword, this.password);
};

// Create and export User model
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
