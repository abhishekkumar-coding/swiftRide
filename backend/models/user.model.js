const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "First name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
      minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true, // Ensure password is not included in query results by default
  },
  socketId: {
    type: String,
  },
});

// Generate authentication token
userSchema.methods.generateAuthToken = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1h", // Optional: Set token expiration
  });
  return token;
};

// Compare password for authentication
userSchema.methods.comparePassword = async function (password) {
  if (!this.password) {
    throw new Error("Password is not set or not retrieved in the query");
  }
  return await bcrypt.compare(password, this.password);
};

// Hash password before saving or using
userSchema.statics.hashPassword = async function (password) {
  if (!password) {
    throw new Error("Password is required for hashing");
  }
  return await bcrypt.hash(password, 10);
};

// Pre-save hook to hash the password automatically
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
