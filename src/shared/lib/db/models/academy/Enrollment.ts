import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  enrollmentDate: Date;
  status: "active" | "completed" | "dropped" | "expired";
  progress: {
    overallProgress: number;
    completedLessons: mongoose.Types.ObjectId[]; // To track specific lesson completion
    lastAccessed: Date;
  };
  certificateIssued: boolean;
  certificateUrl?: string; // Optional: if you generate PDF links
  completionDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const enrollmentSchema = new Schema<IEnrollment>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student reference is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course reference is required"],
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "completed", "dropped", "expired"],
      default: "active",
    },
    progress: {
      overallProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      completedLessons: [
        {
          type: Schema.Types.ObjectId,
          ref: "Lesson", // Assuming you have a Lesson model
        },
      ],
      lastAccessed: {
        type: Date,
        default: Date.now,
      },
    },
    certificateIssued: {
      type: Boolean,
      default: false,
    },
    certificateUrl: {
      type: String,
    },
    completionDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent a student from enrolling in the same course twice
enrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

const Enrollment: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>("Enrollment", enrollmentSchema);

export default Enrollment;