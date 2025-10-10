import mongoose, { Document, Schema } from 'mongoose';

export interface IRelationship extends Document {
  _id: mongoose.Types.ObjectId;
  personId1: mongoose.Types.ObjectId;
  personId2: mongoose.Types.ObjectId;
  relationType: 'Father' | 'Mother' | 'Spouse' | 'Son' | 'Daughter' |
                'Older Sibling' | 'Younger Sibling' | 'Brother' | 'Sister' |
                'Grand Father' | 'Grand Mother' | 'Uncle' | 'Aunt' | 
                'Cousin' | 'Nephew' | 'Niece' | 'Other';
  description?: string;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const RelationshipSchema = new Schema<IRelationship>({
  personId1: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'First person ID is required']
  },
  personId2: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Second person ID is required']
  },
  relationType: {
    type: String,
    enum: [
      'Father', 'Mother', 'Spouse', 'Son', 'Daughter',
      'Older Sibling', 'Younger Sibling', 'Brother', 'Sister',
      'Grand Father', 'Grand Mother', 'Uncle', 'Aunt', 
      'Cousin', 'Nephew', 'Niece', 'Other'
    ],
    required: [true, 'Relationship type is required']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better performance
RelationshipSchema.index({ personId1: 1 });
RelationshipSchema.index({ personId2: 1 });
RelationshipSchema.index({ relationType: 1 });
RelationshipSchema.index({ isApproved: 1 });
RelationshipSchema.index({ personId1: 1, personId2: 1 }, { unique: true });

// Prevent duplicate relationships between same two people
RelationshipSchema.pre('save', function(next) {
  if (this.personId1.equals(this.personId2)) {
    next(new Error('Cannot create relationship with oneself'));
  } else {
    next();
  }
});

export default mongoose.models.Relationship || mongoose.model<IRelationship>('Relationship', RelationshipSchema);
