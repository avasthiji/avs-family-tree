import mongoose, { Document, Schema } from "mongoose";

export interface IRasi extends Document {
  _id: mongoose.Types.ObjectId;
  name: string; // English name (e.g., "Mesham")
  tamilName: string; // Tamil name (e.g., "மேஷம்")
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
}

const RasiSchema = new Schema<IRasi>(
  {
    name: {
      type: String,
      required: [true, "Rasi name is required"],
      unique: true,
      trim: true,
      maxlength: [50, "Rasi name cannot exceed 50 characters"],
    },
    tamilName: {
      type: String,
      required: [true, "Tamil name is required"],
      trim: true,
      maxlength: [50, "Tamil name cannot exceed 50 characters"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
RasiSchema.index({ tamilName: 1 });
RasiSchema.index({ isActive: 1 });

export default mongoose.models.Rasi ||
  mongoose.model<IRasi>("Rasi", RasiSchema);
