/* eslint-disable no-unused-vars */
export enum roles {
  user = "user",
  manager = "manager",
  admin = "admin",
}

export interface AddToCartType {
  product: {};
  quantity: number;
}

export interface UserProps {
  firstname: string;
  lastname: string;
  email: string;
  photo: string;
  phoneNumber: string;
  password: string;
  passwordConfirm: string | undefined;
  passwordChangedAt: Date | number;
  role: roles;
  passwordResetToken: String | undefined;
  passwordResetTokenExpires: Date | undefined;
  active: Boolean;
  favouriteProducts: [];
  isEmailVerified: Boolean;
  emailVerificationToken: string | undefined;
  emailVerificationTokenExpires: string | undefined;
}

export interface UserMethods {
  createPasswordResetToken(): string;
  changedPasswordAfter(jwtTimeStamp: number): Boolean;
  comparePasswords(enteredP: string, encryptedP: string): Promise<Boolean>;
  createEmailVerificationToken(): string;
  AddOrRemoveFavouriteProduct(productId: string): void;
}
