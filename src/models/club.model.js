const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Club name is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Club name must be at least 3 characters'],
      maxlength: [100, 'Club name must not exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Club description is required'],
      trim: true,
      minlength: [10, 'Club description must be at least 10 characters'],
      maxlength: [1000, 'Club description must not exceed 1000 characters'],
    },
  },
  {
    timestamps: true, // auto-manages createdAt and updatedAt
  }
);

// Explicit unique index on name.
// The unique: true on the field above creates the index automatically,
// but declaring it here makes the index definition visible and explicit,
// consistent with how compound indexes will be declared on other models.
clubSchema.index({ name: 1 }, { unique: true });

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
