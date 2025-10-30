import mongoose, { Document, Schema } from 'mongoose';

export interface IKuladeivam extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // English name
  tamilName?: string; // Tamil name (optional)
  templeLocation?: string; // Temple location
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const KuladeivamSchema = new Schema<IKuladeivam>({
  name: {
    type: String,
    required: [true, 'Kuladeivam name is required'],
    unique: true,
    trim: true,
    maxlength: [200, 'Kuladeivam name cannot exceed 200 characters']
  },
  tamilName: {
    type: String,
    required: false,
    trim: true,
    default: '',
    maxlength: [200, 'Tamil name cannot exceed 200 characters']
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
KuladeivamSchema.index({ name: 1 });
KuladeivamSchema.index({ tamilName: 1 });
KuladeivamSchema.index({ isActive: 1 });

export default mongoose.models.Kuladeivam || mongoose.model<IKuladeivam>('Kuladeivam', KuladeivamSchema);

