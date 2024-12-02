const userModel = require("../models/user.model");
const userService = require("../services/user.services");
const { validationResult } = require("express-validator");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, password } = req.body;

  // Hash the password
  const hashedPassword = await userModel.hashPassword(password);

  // Create user in the database
  let user;
  try {
    user = await userService.createUser({
      firstname : fullname.firstname,
      lastname  : fullname.lastname,
      email,
      password: hashedPassword,
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate email error
      return res.status(400).json({ message: "Email is already in use" });
    }
    return next(error); // Pass other errors to the global error handler
  }

  // Generate authentication token
  const token = user.generateAuthToken();

  // Exclude password from the response
  const { password: _, ...userWithoutPassword } = user.toObject();

  res.status(201).json({ token, user: userWithoutPassword });
};
