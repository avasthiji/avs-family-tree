import mongoose, { Document, Schema } from 'mongoose';

export interface IOTP extends Document {
  _id: mongoose.Types.ObjectId;
  identifier: string; // email or mobile
  otp: string; // 6-digit OTP
  type: 'email' | 'mobile';
  purpose: 'registration' | 'login' | 'reset-password';
  expiresAt: Date;
  attempts: number;
  isUsed: boolean;
  createdAt: Date;
}

const OTPSchema = new Schema<IOTP>({
  identifier: {
    type: String,
    required: [true, 'Identifier (email or mobile) is required'],
    trim: true
  },
  otp: {
    type: String,
    required: [true, 'OTP is required'],
    length: [6, 'OTP must be exactly 6 digits'],
    validate: {
      validator: function(v: string) {
        return /^\d{6}$/.test(v);
      },
      message: 'OTP must be exactly 6 digits'
    }
  },
  type: {
    type: String,
    enum: ['email', 'mobile'],
    required: [true, 'OTP type is required']
  },
  purpose: {
    type: String,
    enum: ['registration', 'login', 'reset-password'],
    required: [true, 'OTP purpose is required']
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiry date is required'],
    default: function() {
      return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    }
  },
  attempts: {
    type: Number,
    default: 0,
    max: [3, 'Maximum 3 attempts allowed']
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better performance
OTPSchema.index({ identifier: 1, type: 1 });
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired OTPs

// Ensure OTP expires after 5 minutes
OTPSchema.pre('save', function(next) {
  if (this.isNew) {
    this.expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  }
  next();
});

export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', OTPSchema);
