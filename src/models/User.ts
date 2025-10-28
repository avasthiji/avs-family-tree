import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email?: string;
  mobile?: string;
  password: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isApprovedByAdmin: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  role: 'user' | 'admin' | 'matchmaker';
  
  // Profile Details
  gender?: 'Male' | 'Female' | 'Other';
  dob?: Date;
  placeOfBirth?: string;
  timeOfBirth?: string;
  height?: number;
  rasi?: string;
  natchathiram?: string;
  gothiram?: string;
  primaryPhone?: string;
  secondaryPhone?: string;
  qualification?: string;
  jobDesc?: string;
  salary?: string;
  bioDesc?: string;
  partnerDesc?: string;
  workPlace?: string;
  nativePlace?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  citizenship?: string;
  kuladeivam?: string;
  
  // Marriage Profile
  enableMarriageFlag: boolean;
  matchMakerId?: mongoose.Types.ObjectId;
  
  // Profile Picture
  profilePicture?: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  mobile: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        return !v || /^[6-9]\d{9}$/.test(v);
      },
      message: 'Please enter a valid 10-digit mobile number'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isMobileVerified: {
    type: Boolean,
    default: false
  },
  isApprovedByAdmin: {
    type: Boolean,
    default: false
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
  role: {
    type: String,
    enum: ['user', 'admin', 'matchmaker'],
    default: 'user'
  },
  
  // Profile Details
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other']
  },
  dob: Date,
  placeOfBirth: String,
  timeOfBirth: String,
  height: {
    type: Number,
    min: [100, 'Height must be at least 100 cm'],
    max: [250, 'Height cannot exceed 250 cm']
  },
  rasi: String,
  natchathiram: String,
  gothiram: String,
  primaryPhone: String,
  secondaryPhone: String,
  qualification: String,
  jobDesc: String,
  salary: String,
  bioDesc: {
    type: String,
    maxlength: [500, 'Bio description cannot exceed 500 characters']
  },
  partnerDesc: {
    type: String,
    maxlength: [500, 'Partner description cannot exceed 500 characters']
  },
  workPlace: String,
  nativePlace: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  citizenship: String,
  kuladeivam: String,
  
  // Marriage Profile
  enableMarriageFlag: {
    type: Boolean,
    default: false
  },
  matchMakerId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Profile Picture
  profilePicture: String,
  
  // Audit
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
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ mobile: 1 }, { unique: true, sparse: true });
UserSchema.index({ gothiram: 1 });
UserSchema.index({ nativePlace: 1 });
UserSchema.index({ isApprovedByAdmin: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ enableMarriageFlag: 1 });

// Ensure at least one of email or mobile is provided
UserSchema.pre('validate', function(next) {
  if (!this.email && !this.mobile) {
    next(new Error('Either email or mobile number is required'));
  } else {
    next();
  }
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
