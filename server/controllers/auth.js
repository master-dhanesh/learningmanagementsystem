import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import User from "../models/user";
import { comparePassword, hashPassword } from "../utils/auth";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6)
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");

    let userExists = await User.findOne({ email }).exec();
    if (userExists) return res.status(400).send("Email is taken");

    //  hash password
    const hashedPasswod = await hashPassword(password);

    // register
    const user = new User({
      name,
      email,
      password: hashedPasswod,
    });
    await user.save();
    // console.log("saved user", user);
    return res.status(201).json({ ok: true });
  } catch (err) {
    return res.status(400).send("Error. Try again");
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(404).send("No user found");
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong credientials");

    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.password = undefined;
    res.cookie("token", token, {
      httpOnly: true,
      // secure: true //for https only
    });

    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again");
  }
};

export const logout = (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (error) {
    console.log(err);
  }
};

export const currentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.auth._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );

    if (!user) return res.status(400).send("User not found");

    // prepare for email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: [process.env.EMAIL_FROM],
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
              <h1>Reset password</h1>
              <p>Use this code to reset your password</p>
              <h2 style="color: red;">${shortCode}</h2>
              <i>sheryians.com</i>
              </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => console.log(err));
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.log(email, code, newPassword);
    //  hash password
    const hashedPasswod = await hashPassword(newPassword);

    const user = await User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      { password: hashedPasswod, passwordResetCode: "" }
    ).exec();

    if (!user) return res.status(400).send("Wrong Secret Code");
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.status(400).send("Error! Try again");
  }
};
