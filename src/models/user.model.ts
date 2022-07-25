/* eslint-disable no-unused-vars */
/* eslint-disable no-invalid-this */
/* eslint-disable space-before-function-paren */
import { Schema, model, Model } from "mongoose";
import valid from "validator";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import crypto from "crypto";

config();

const { SALT_ROUNDS } = process.env;

export enum roles {
  user = "user",
  manager = "manager",
  admin = "admin",
}

export interface UserProps {
  firstname: string;
  lastname: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date | number;
  role: roles;
  passwordResetToken: String | undefined;
  passwordResetExpires: Date | undefined;
}

export interface UserMethods {
  createPasswordResetToken(): string;
  changedPasswordAfter(jwtTimeStamp: number): Boolean;
  comparePasswords(enteredP: string, encryptedP: string): Promise<boolean>;
}

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
  console.log(resetToken, this.passwordResetToken);
  // send the unencrypted reset token to users email
  return resetToken;
};

const User = model<UserProps, UserModel>("User", userSchema);

export default User;
