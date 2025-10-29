import mongoose, { Document, Schema } from 'mongoose';

export interface IGothiram extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // English name
  tamilName: string; // Tamil name
  godOfWorship?: string; // God associated with this Gothiram
  templeLocation?: string; // Temple location
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const GothiramSchema = new Schema<IGothiram>({
  name: {
    type: String,
    required: [true, 'Gothiram name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Gothiram name cannot exceed 100 characters']
  },
  tamilName: {
    type: String,
    required: [true, 'Tamil name is required'],
    trim: true,
    maxlength: [100, 'Tamil name cannot exceed 100 characters']
  },
  godOfWorship: {
    type: String,
    trim: true,
    maxlength: [200, 'God of worship cannot exceed 200 characters']
  },
  templeLocation: {
    type: String,
    trim: true,
    maxlength: [200, 'Temple location cannot exceed 200 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better performance
GothiramSchema.index({ name: 1 });
GothiramSchema.index({ tamilName: 1 });
GothiramSchema.index({ isActive: 1 });

export default mongoose.models.Gothiram || mongoose.model<IGothiram>('Gothiram', GothiramSchema);

