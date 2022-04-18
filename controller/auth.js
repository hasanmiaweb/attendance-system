const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerController = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Something was Wrong",
    });
  }

  try {
    let user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).json({
        message: "User already Exist",
      });
    }
    user = new User({ name, email, password });
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);
    user.password = hash;
    await user.save();
    return res.status(201).json({
      message: "User Created Successfully",
      user,
    });
  } catch (e) {
    next(e);
  }
};

// LOGIN SYSTEM
const loginController = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }
    delete user._doc.password;

    const token = jwt.sign(user._doc, "secret-key", { expiresIn: "2h" });

    return res.status(200).json({
      message: "Login Successfully",
      token,
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  loginController,
  registerController,
};
