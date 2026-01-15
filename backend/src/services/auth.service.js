import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


//
// Register new user
//
export const registerUserService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });
  // console.log("existing",existingUser);
  

  if (existingUser) {
    throw new Error("User already exists");
  }
  // console.log("before saving to user create");
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);


  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });
  // console.log("going to return ", user);
  

  return user;
};

//
// Login user
//
export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
};
