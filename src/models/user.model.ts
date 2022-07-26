/* eslint-disable no-invalid-this */
import crypto from "crypto";
import bcrypt from "bcrypt";
import valid from "validator";
import { config } from "dotenv";
import { Schema, model, Model } from "mongoose";
import { UserProps, UserMethods, roles } from "../interface";

config();

const { SALT_ROUNDS } = process.env;

type UserModel = Model<UserProps, {}, UserMethods>;

const userSchema = new Schema<UserProps, UserModel, UserMethods>({
  firstname: {
    type: String,
    minlength: 2,
    maxlength: 15,
    required: [true, "Please enter your firstname"],
  },
  lastname: {
    type: String,
    minlength: 2,
    maxlength: 15,
    required: [true, "Please enter your lasttname"],
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: true,
    validate: [valid.isEmail, "Please enter a valid email"],
  },
  photo: String,
  password: {
    type: String,
    minlength: 8,
    required: [true, "Please provide a password"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    minlength: 8,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on create() or save()
      validator: function (el: string): Boolean {
        const user = this as UserProps;
        return el === user.password;
      },
      message: "Psswords aren't the same",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  role: {
    type: String,
    enum: [roles.admin, roles.user, roles.manager],
    default: roles.user,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, Number(SALT_ROUNDS as string));
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  this.passwordChangedAt = Date.now() - 1000;

  next();
});

userSchema.pre("find", function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePasswords = async function (enteredP: string, encryptedP: string) {
  return await bcrypt.compare(enteredP, encryptedP);
};

userSchema.methods.changedPasswordAfter = function (jwtTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    return jwtTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  // create unencrypted reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  // create and save encrypted reset token to database
  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  // send the unencrypted reset token to users email
  return resetToken;
};

const User = model<UserProps, UserModel>("User", userSchema);

export default User;
