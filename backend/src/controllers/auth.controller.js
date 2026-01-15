import {
  registerUserService,
  loginUserService
} from "../services/auth.service.js";

import { generateToken } from "../utils/token.js";

//
// Register Controller
//
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // console.log(req.body);
    

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    // console.log("before user going");
    
    const user = await registerUserService({
      name,
      email,
      password
    });
    // console.log("user-->",user);
    

    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

//
// Login Controller
//
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required"
      });
    }

    const user = await loginUserService({ email, password });

    const token = generateToken(user._id);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  }catch (error) {
  console.error("FULL ERROR STACK:", error);
  
  res.status(400).json({
    message: error.message,
    stack: error.stack
  });


  }
};
