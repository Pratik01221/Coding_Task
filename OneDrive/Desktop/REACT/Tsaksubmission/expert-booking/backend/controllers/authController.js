const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Expert = require("../models/Expert");

const signToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};



// USER REGISTER
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : "";

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      role: role || "user",
      profileImage
    });

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }
    });

  } catch (err) {
    next(err);
  }
};



// EXPERT REGISTER
exports.registerExpert = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      category,
      experience,
      bio,
      hourlyRate
    } = req.body;

    const profileImage = req.file ? `/uploads/${req.file.filename}` : "";

    const expertExists = await Expert.findOne({ email });
    if (expertExists) return res.status(400).json({ error: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    const expert = await Expert.create({
      name,
      email,
      password: hash,
      role: "expert",
      phone,
      category,
      experience,
      bio,
      hourlyRate,
      speciality: category,
      pricePerHour: hourlyRate,
      rating: 0,
      profileImage,
      avatar: profileImage
    });

    const token = signToken(expert);

    res.json({
      token,
      user: {
        id: expert._id,
        name: expert.name,
        email: expert.email,
        role: expert.role,
        profileImage: expert.profileImage
      }
    });

  } catch (err) {
    next(err);
  }
};



// COMMON LOGIN FUNCTION
const loginCommon = async (Model, email, password) => {
  const user = await Model.findOne({ email });

  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) throw new Error("Invalid credentials");

  const token = signToken(user);

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
};



// USER LOGIN
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginCommon(User, email, password);

    res.json(result);

  } catch (err) {
    next(err);
  }
};



// EXPERT LOGIN
exports.loginExpert = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await loginCommon(Expert, email, password);

    res.json(result);

  } catch (err) {
    next(err);
  }
};