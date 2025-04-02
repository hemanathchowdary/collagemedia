import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  code: string;
  instructor: mongoose.Types.ObjectId;
  schedule: string;
  description?: string;
  materials: number;
  students: mongoose.Types.ObjectId[];
  semester: 'current' | 'past' | 'upcoming';
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: [true, 'Please add a course title'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Please add a course code'],
      unique: true,
      trim: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please add an instructor'],
    },
    schedule: {
      type: String,
      required: [true, 'Please add course schedule'],
    },
    description: {
      type: String,
    },
    materials: {
      type: Number,
      default: 0,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    semester: {
      type: String,
      enum: ['current', 'past', 'upcoming'],
      default: 'current',
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model<ICourse>('Course', courseSchema);
export default Course; 