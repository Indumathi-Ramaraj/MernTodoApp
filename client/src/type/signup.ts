type PasswordValidationAccessorType =
  | "minLength"
  | "digit"
  | "lowercase"
  | "uppercase"
  | "specialChar";

type PasswordFieldsType = {
  value: string;
  isError: boolean;
  helperText: string;
};

export type PasswordValidationType = {
  accessor: PasswordValidationAccessorType;
  helperText: string;
  isValid: boolean;
};

export type PasswordFields = {
  password: PasswordFieldsType;
  confirmPassword: PasswordFieldsType;
};
export type ShowPasswordType = {
  password: boolean;
  confirmPassword: boolean;
};

export type PasswordType = "password" | "confirmPassword";

export type authValues = {
  name: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
};
