import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  organizer: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Event title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [1000, 'Event description cannot exceed 1000 characters']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(v: Date) {
        return v > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [200, 'Event location cannot exceed 200 characters']
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Event organizer is required']
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
EventSchema.index({ eventDate: 1 });
EventSchema.index({ isPublished: 1 });
EventSchema.index({ organizer: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
