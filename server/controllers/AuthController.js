import UserModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import OTP from "../models/otpModel.js";
import nodeMailer from "nodemailer";

// Register new user
export const registerUser = async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPass;
  const newUser = new UserModel(req.body);
  const { username } = req.body;
  try {
    // addition new
    const oldUser = await UserModel.findOne({ username });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    // changed
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendOTP = async (username, otp) => {
  try {
    console.log(
      "host",
      process.env.EMAIL_HOST,
      process.env.EMAIL_USER,
      process.env.PASSWORD
    );

    let transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASSWORD,
      },
    });

    let mailOptions = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: username,
      subject: "OTP for your account",
      text: `Your OTP is ${otp}`,
    });
    console.log("111111111111111111");
    console.log("OTP sent to email", mailOptions);

    return mailOptions; // Trả về thông tin về email đã gửi thành công
  } catch (error) {
    console.error("Error sending OTP email:", error.message);
    throw new Error("Failed to send OTP email"); // Xử lý lỗi bằng cách throw ra ngoại lệ
  }
};

export const sendOtpByEmail = async (req, res) => {
  try {
    const { username } = req.body;
    console.log("body", req.body);
    console.log("username", username);

    // Kiểm tra xem người dùng đã tồn tại hay chưa
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Email has already existed" });
    }

    // Tạo mã OTP mới
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });

    console.log("otp", otp);

    // Lưu mã OTP vào cơ sở dữ liệu
    await OTP.create({ username, otp });

    // Gửi mã OTP qua email
    await sendOTP(username, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};

export const registerUserWithOTP = async (req, res) => {
  try {
    const { username, password, firstname, lastname, otp } = req.body;
    console.log("req body", req.body);
    // Kiểm tra xem người dùng đã tồn tại hay chưa
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Email has already existed" });
    }

    // Kiểm tra xem mã OTP đã nhập có chính xác hay không
    const otpRecord = await OTP.findOne({ username, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      firstname,
      lastname,
    });

    // Tạo JWT token
    // changed
    const user = await newUser.save();
    const token = jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWTKEY,
      { expiresIn: "1h" }
    );

    // Trả về thông tin người dùng và token
    res.status(200).json({ user: newUser, token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to register user", error: error.message });
  }
};

// Login User

// Changed
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username: username });

    if (user) {
      const validity = await bcrypt.compare(password, user.password);

      if (!validity) {
        res.status(400).json({ message: "Incorrect password" });
      } else {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWTKEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Failed to login", error: err.message });
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    await OTP.create({ username, otp });
    await sendOTP(username, otp);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send OTP", error: error.message });
  }
};
