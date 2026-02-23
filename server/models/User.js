const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["client", "lawyer", "admin"],
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
      default: null,
    },

    sex: {
      type: String,
      enum: ["Male", "Female", "Other", ""],
      default: "",
    },

    email: {
      type: String,
      unique: true,
      required: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      // required: true, (Removed for Social Login support)
    },

    plan: {
      type: String,
      enum: ["free", "silver", "gold", "diamond"],
      default: "free",
    },

    aiUsage: {
      count: { type: Number, default: 0 },
      firstUsedAt: { type: Date, default: null },
    },

    specialization: String,
    experience: Number,

    location: {
      city: String,
      state: String, // Added for State Filtering
      lat: Number,
      lng: Number,
    },

    resume: String,

    // --- NEW PROFILE FIELDS ---
    bio: { type: String, default: "" }, // About Me

    profileImage: { type: String, default: "" }, // URL from Uploads

    languages: { type: [String], default: ["English", "Hindi"] },

    courts: { type: [String], default: [] }, // Supreme Court, High Court, etc.

    education: [{
      degree: String,
      college: String,
      year: Number
    }],

    socials: {
      linkedin: String,
      website: String,
      twitter: String
    },

    consultationFee: { type: Number, default: 0 }, // Per hour/session

    availability: {
      type: String,
      default: "Mon-Fri, 9am - 6pm"
    },

    isProfileComplete: { type: Boolean, default: false }, // For gamification/prompting
    // --------------------------

    stats: {
      profileViews: { type: Number, default: 0 },
      searchAppearances: { type: Number, default: 0 },
      yearsExperience: { type: Number, default: 0 }
    },

    // VERIFICATION SYSTEM
    barCouncilId: { type: String, default: "" }, // e.g. MAH/2345/2020
    idCardImage: { type: String, default: "" },  // URL of uploaded ID
    verificationStatus: {
      type: String,
      enum: ["unverified", "pending", "verified", "rejected"],
      default: "unverified"
    },
    rejectionReason: { type: String, default: "" },

    // STUDENT FIELDS
    isStudent: { type: Boolean, default: false },
    studentRollNumber: { type: String, default: "" },

    verified: {
      type: Boolean,
      default: false,
    },

    settings: {
      notifications: {
        email: { type: Boolean, default: true },
        push: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false }
      },
      privacy: {
        profileVisible: { type: Boolean, default: true },
        showStatus: { type: Boolean, default: true }
      },
      theme: { type: String, default: 'Dark' }
    }
  },
  { timestamps: true }
);

const { syncLawyer, deleteRecord } = require("../utils/algolia");

// userSchema.post("save", function (doc) {
//   if (doc.role === "lawyer") {
//     syncLawyer(doc);
//   }
// });

userSchema.post("findOneAndDelete", function (doc) {
  if (doc && doc.role === "lawyer") {
    deleteRecord("lawyers", doc._id.toString());
  }
});

module.exports = mongoose.model("User", userSchema);
