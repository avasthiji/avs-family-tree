import mongoose, { Document, Schema } from 'mongoose';

export interface INakshatram extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // English name (e.g., "Ashwini")
  tamilName: string; // Tamil name (e.g., "அஸ்வினி")
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const NakshatramSchema = new Schema<INakshatram>({
  name: {
    type: String,
    required: [true, 'Nakshatram name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Nakshatram name cannot exceed 100 characters']
  },
  tamilName: {
    type: String,
    required: [true, 'Tamil name is required'],
    trim: true,
    maxlength: [100, 'Tamil name cannot exceed 100 characters']
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

// Indexes for better performance
NakshatramSchema.index({ name: 1 });
NakshatramSchema.index({ tamilName: 1 });
NakshatramSchema.index({ isActive: 1 });

export default mongoose.models.Nakshatram || mongoose.model<INakshatram>('Nakshatram', NakshatramSchema);

