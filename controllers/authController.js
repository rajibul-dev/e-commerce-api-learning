const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");
const { attatchCookiesToResponse, createTokenUser } = require("../utils");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  const emailAleradyExists = await User.findOne({ email });
  if (emailAleradyExists) {
    throw new BadRequestError("The email already exists in our database");
  }

  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const user = await User.create({ name, email, password, role });

  const toeknUser = createTokenUser(user);
  attatchCookiesToResponse({ res, user: toeknUser });
  res.status(StatusCodes.CREATED).json({ user: toeknUser });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new UnauthenticatedError("Invalid credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Wrong password");
  }

  const toeknUser = createTokenUser(user);
  attatchCookiesToResponse({ res, user: toeknUser });
  res.status(StatusCodes.OK).json({ user: toeknUser });
};

const logout = (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(StatusCodes.OK).send("User logged out!");
};

module.exports = { register, login, logout };
