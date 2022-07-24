/* eslint-disable no-invalid-this */
/* eslint-disable space-before-function-paren */
import { Schema, model, Document, SchemaDefinitionProperty } from "mongoose";
import valid from "validator";
import bcrypt from "bcrypt";
import { config } from "dotenv";

config();

const { SALT_ROUNDS } = process.env;

export interface UserProps extends Document {
  firstname: string;
  lastname: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string | undefined;
}

const userSchema = new Schema({
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
    required: [true, "Please provide a password"],
    validate: {
      // This only works on create() or save()
      validator: function (el: SchemaDefinitionProperty<string>): Boolean {
        const user = this as UserProps;
        return el === user.password;
      },
    },
  },
});

userSchema.pre("save", async function (next) {
  const user = this as UserProps;
  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, Number(SALT_ROUNDS as string));
  user.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  enteredPassword: string,
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, enteredPassword);
};

const User = model<UserProps>("User", userSchema);

export default User;
