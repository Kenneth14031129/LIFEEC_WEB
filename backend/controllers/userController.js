import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import nodemailer from "nodemailer";
import { generateOTP } from "../utils/otpUtils.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "No user found with this email" });
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Save OTP to user
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "LIFEEC Password Reset OTP",
      html: `
        <h1>Password Reset Request</h1>
        <p>Your OTP for password reset is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || !user.otpExpiry) {
      return res.status(400).json({ message: "No OTP found for this user" });
    }

    if (Date.now() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Generate a temporary token for password reset
    const token = generateToken(user._id, "10m"); // Token valid for 10 minutes

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      if (user.isArchived) {
        return res
          .status(401)
          .json({ message: "This account has been archived" });
      }
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Register new user
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;

    // Check if user type requires verification
    const requiresVerification = ["admin", "owner"].includes(userType);

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    let otp = null;
    let otpExpiry = null;

    if (requiresVerification) {
      const otpCode = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      user.otp = {
        code: otpCode,
        expiry: otpExpiry,
        verified: false,
      };

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "LIFEEC Registration OTP",
        html: `
          <h1>Welcome to LIFEEC</h1>
          <p>Your OTP for registration is: <strong>${otpCode}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
        `,
      });
    }

    const user = await User.create({
      fullName,
      email,
      password,
      userType,
      otp,
      otpExpiry,
      isVerified: !requiresVerification, // Set to true for non-admin/owner accounts
    });

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      requiresVerification,
      token: requiresVerification ? null : generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    // Updated OTP check
    if (!user.otp || !user.otp.code || !user.otp.expiry) {
      return res.status(400).json({ message: "No OTP found for this user" });
    }

    if (Date.now() > user.otp.expiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (user.otp.code !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.isVerified = true;
    user.otp = null; // Clear OTP after successful verification
    await user.save();

    res.json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ isArchived: false }, { isArchived: { $exists: false } }],
    }).select("-password");

    // Sort users by verification status and creation date
    const sortedUsers = users.sort((a, b) => {
      // Sort by verification status first
      if (a.isVerified !== b.isVerified) {
        return a.isVerified ? 1 : -1;
      }
      // Then sort by creation date
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json(sortedUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        phone: user.phone || "",
        location: user.location || "",
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.fullName = req.body.fullName || user.fullName;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.location = req.body.location || user.location;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        userType: updatedUser.userType,
        phone: updatedUser.phone,
        location: updatedUser.location,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { currentPassword, newPassword } = req.body;

    // Verify current password
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new user
export const addUser = async (req, res) => {
  try {
    const { fullName, email, password, userType } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Check if user type requires verification (admin/owner)
    const requiresVerification = ["admin", "owner"].includes(
      userType.toLowerCase()
    );

    let otpData = null;

    if (requiresVerification) {
      // Generate OTP for admin/owner
      const otpCode = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

      otpData = {
        code: otpCode,
        expiry: otpExpiry,
        verified: false,
      };

      // Send OTP email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "LIFEEC Registration OTP",
        html: `
          <h1>Welcome to LIFEEC</h1>
          <p>Your OTP for registration is: <strong>${otpCode}</strong></p>
          <p>This OTP will expire in 10 minutes.</p>
        `,
      });
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
      userType,
      otp: otpData,
      isVerified: !requiresVerification, // Set to true for non-admin/owner accounts
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        requiresVerification,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const archiveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isArchived = true;
    user.archivedDate = new Date();
    await user.save();

    res.json({ message: "User archived successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getArchivedUsers = async (req, res) => {
  try {
    const users = await User.find({
      isArchived: true,
    }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const restoreUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isArchived = false;
    user.archivedDate = null;
    await user.save();

    res.json({ message: "User restored successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    user.isVerified = true;
    await user.save();

    // Send confirmation email to user
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "LIFEEC Account Verified",
      html: `
        <h1>Welcome to LIFEEC!</h1>
        <p>Your account has been verified successfully.</p>
        <p>You can now log in to your account using your email and password.</p>
      `,
    });

    res.json({
      message: "User verified successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store user email before deletion for notification
    const userEmail = user.email;

    // Delete the user
    await User.deleteOne({ _id: req.params.id });

    // Send rejection email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "LIFEEC Account Registration Status",
      html: `
        <h1>Account Registration Update</h1>
        <p>We regret to inform you that your account registration has been declined.</p>
        <p>If you believe this is an error, please contact our support team or try registering again.</p>
      `,
    });

    res.json({ message: "User rejected and removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
