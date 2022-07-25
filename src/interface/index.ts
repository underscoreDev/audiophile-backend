/* eslint-disable no-unused-vars */
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
