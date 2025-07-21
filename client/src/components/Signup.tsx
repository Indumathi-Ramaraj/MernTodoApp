import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signup } from "../action/signup";
import type {
  authValues,
  PasswordFields,
  PasswordType,
  PasswordValidationType,
  ShowPasswordType,
} from "../type/signup";
import { CircleCheckBig, CircleX, Eye, EyeOff, Info } from "lucide-react";

const passwordValidationConstantList: Array<PasswordValidationType> = [
  {
    accessor: "minLength",
    helperText: "At least 6 characters long",
    isValid: true,
  },
  {
    accessor: "digit",
    helperText: "At least one digit",
    isValid: true,
  },
  {
    accessor: "lowercase",
    helperText: "At least one lowercase character",
    isValid: true,
  },
  {
    accessor: "uppercase",
    helperText: "At least one uppercase character",
    isValid: true,
  },
  {
    accessor: "specialChar",
    helperText: "At least one special character, e.g.@!#?%",
    isValid: true,
  },
];

export default function Signup() {
  const [authValues, setAuthValues] = useState<authValues>({
    name: "",
    email: "",
    countryCode: "+91",
    phoneNumber: "",
  });
  const [validation, setValidation] = useState(false);
  const [password, setPassword] = useState<PasswordFields>({
    password: { value: "", isError: false, helperText: "" },
    confirmPassword: {
      value: "",
      isError: false,
      helperText: "The password is not matching!",
    },
  });

  // State to toggle the visibility of password fields (new and confirm)
  const [showPassword, setShowPassowrd] = useState<ShowPasswordType>({
    password: false,
    confirmPassword: false,
  });
  const [passwordValidationConstants, setPasswordValidationConstants] =
    useState<Array<PasswordValidationType>>(passwordValidationConstantList);

  const navigate = useNavigate();

  const checkPasswordValidation = (passwordValue: string) => {
    // Regular expressions for different password validation rules
    const conditions: any = {
      lowercase: /(?=.*[a-z])/,
      uppercase: /(?=.*[A-Z])/,
      digit: /(?=.*\d)/,
      specialChar: /(?=.*[$^-_+=`/.><|:;#()@!%*?&])/,
      minLength: /^.{6,}$/, // Minimum 6 characters
    };
    // Map through validation constants and check if each condition is met
    const passwordValidationConstantsCloned = passwordValidationConstants.map(
      (state: any) => {
        const condition = conditions[state.accessor];
        state.isValid = condition ? condition.test(passwordValue) : true;
        return state;
      }
    );
    // Update state with new validation results
    setPasswordValidationConstants([...passwordValidationConstantsCloned]);
  };

  const handleSubmit = () => {
    signup(
      authValues.name,
      authValues.email,
      authValues.countryCode,
      authValues.phoneNumber,
      password.password.value
    )
      .then((res) => {
        if (res.message === "success") {
          toast.success("Successfully Registered");
          navigate("/login");
        } else toast.error(res.message);
      })
      .catch((err) => {
        toast.error(
          `${
            err.response.data.message
              ? err.response.data.message
              : "Error in registration"
          }`
        );
      });
  };

  const authHandler = (name: string, value: string) =>
    setAuthValues((prev) => {
      return { ...prev, [name]: value };
    });

  const handleShowPassword = (type: PasswordType) => {
    setShowPassowrd({
      ...showPassword,
      [type]: !showPassword[type],
    });
  };


console.log("authValues.phoneNumber.length..",authValues.phoneNumber.length);
  const handleChangePassword = (type: PasswordType, value: string) => {
    let passwordState: PasswordFields;
    if (type === "password") {
      // Update state for the new password field
      passwordState = {
        ...password,
        password: {
          ...password.password,
          value: value,
          isError: false,
        },
      };
    } else if (type === "confirmPassword") {
      // Update state for the confirm password field, including error checks
      passwordState = {
        ...password,
        confirmPassword: {
          ...password.confirmPassword,
          value: value,
          isError: value.length < 8 || password.password.value !== value,
        },
      };
    } else {
      return;
    }
    setPassword(passwordState);
  };
  return (
    <div className="flex justify-center items-center bg-gray-500 w-full h-screen">
      <div className="bg-white p-6 rounded-md w-full max-w-sm shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Register</h2>
        <form
          onSubmit={(event: any) => {
            event.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-y-4"
        >
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Enter Name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(event) => authHandler("name", event?.target.value)}
              value={authValues.name}
            />
            {validation && !authValues.name && (
              <p className="text-red-600 error self-start text-xs mt-1">
                Name is required
              </p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              name="email"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(event) => authHandler("email", event?.target.value)}
              value={authValues.email}
            />
            {validation && !authValues.email && (
              <p className="text-red-600 error self-start text-xs mt-1">
                Email is required
              </p>
            )}
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block font-medium mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="+91"
                value={authValues.countryCode}
                onChange={(e) => authHandler("countryCode", e.target.value)}
                className="w-24 px-3 py-2 border rounded text-center"
              />

              <input
                type="text"
                placeholder="Phone number"
                value={authValues.phoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  // Only update if it's digits and ≤ 10 chars
                  // if (/^\d{0,10}$/.test(value)) {
                  //   authHandler("phoneNumber", value);
                  // }
                  authHandler("phoneNumber", value);
                }}
                className="flex-1 px-3 py-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-6">
              {validation && !authValues.countryCode && (
                <p className="col-span-2 text-red-600 error self-start text-xs mt-1">
                  Country Code is required
                </p>
              )}
              {validation && !authValues.phoneNumber && (
                <p className="col-start-3 col-span-4 text-red-600 error self-start text-xs mt-1">
                  Phone number is required
                </p>
              )}
              {validation &&
                authValues.phoneNumber &&
                authValues.phoneNumber.length > 10 && (
                  <p className="col-start-3 col-span-4 text-red-600 error self-start text-xs mt-1">
                    Phone number cannot be more than 10 digits.
                  </p>
                )}
            </div>
          </div>
          <div
            className={`relative text-gray-600 rounded-lg outline-none bg-white focus:bg-white`}
          >
            <div
              className={`relative text-gray-600 rounded-lg outline-none bg-white focus:bg-white`}
            >
              <label htmlFor="password" className="block font-medium mb-1">
                Password
              </label>
              <input
                className="rounded-lg py-3 px-6 mb-4 bg-gray-100 h-10 w-full text-black focus:outline-transparent text-base"
                placeholder="Password"
                onChange={(e) => {
                  handleChangePassword("password", e.target.value);
                  checkPasswordValidation(e.target.value);
                }}
                name="new-password"
                autoComplete="off"
                type={showPassword.password ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => handleShowPassword("password")}
                className={`absolute rounded-full p-1 mt-1.5 cursor-pointer blue-text right-1`}
              >
                {showPassword.password ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {password.password.value.length > 0 && (
              <div className="bg-inherit mb-4">
                <div className="flex gap-1 align-center text-xs text-neutral-600 mb-3">
                  {<Info size={15} absoluteStrokeWidth />}Ensure that these
                  requirements are met:
                </div>
                <div className="flex-col gap-1">
                  {passwordValidationConstants.map((validation) => (
                    <div
                      key={validation.accessor}
                      className={` 
                          flex gap-1 align-center
                          py-0.5 px-2 border-l-4
                          ${
                            validation.isValid
                              ? "validation-success"
                              : "validation-error"
                          }
                          font-medium m-0 text-xs
                        `}
                    >
                      {validation.isValid ? (
                        <CircleCheckBig size={15} absoluteStrokeWidth />
                      ) : (
                        <CircleX size={15} />
                      )}
                      {validation.helperText}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div
              className={`relative  text-gray-600 rounded-lg outline-none bg-white focus:bg-white`}
            >
              <label htmlFor="password" className="block font-medium mb-1">
                Confirm Password
              </label>
              <input
                className="rounded-lg py-3 px-6 bg-gray-100 h-10 w-full text-black focus:outline-transparent text-base"
                placeholder="Confirm Password"
                onChange={(e) =>
                  handleChangePassword("confirmPassword", e.target.value)
                }
                name="confirm-password"
                autoComplete="off"
                type={showPassword.confirmPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => handleShowPassword("confirmPassword")}
                className={`absolute rounded-full p-1 mt-1.5 cursor-pointer blue-text right-1`}
              >
                {showPassword.confirmPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeOff className="w-5 h-5" />
                )}
              </button>
            </div>
            {password.confirmPassword.isError && (
              <p className="text-red-600 error self-start text-xs mt-1 px-2 font-medium">
                {password.confirmPassword.helperText}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
            onClick={() => setValidation(true)}
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm">Already have an account?</p>
        <Link
          to="/login"
          className="mt-2 inline-block w-full text-center border border-gray-300 bg-gray-100 py-2 rounded hover:bg-gray-200 transition duration-200"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
