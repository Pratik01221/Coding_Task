const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    profileImage: { type: String, default: '' }, // Path to uploaded image
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);

