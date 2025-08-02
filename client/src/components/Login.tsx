import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../action/login";
import { useFormik } from "formik";
import * as yup from "yup";
import { Eye, EyeOff, Send } from "lucide-react";
import backgroundTodo from "../asset/background.jpeg";

const telegramUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "";
export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [validation, setValidation] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: () => {
      login(formik.values.email, formik.values.password)
        .then((res) => {
          if (res.message === "success") {
            toast.success("Login Successfully");
            if (!res.user.telegramChatId) {
              toast.warning(
                <span>
                  Please link your to telegram and enable notifications.
                  <a
                    href={`https://t.me/${telegramUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Send className="w-4 h-4" />
                    Link to Telegram
                  </a>
                  <span className="ml-1">Click</span>{" "}
                  <p className="font-semibold">/start</p>
                </span>
              );
              alert(
                `Please link your Telegram account to enable notifications.\nVisit: https://t.me/${telegramUsername}.\nClick /start`
              );
            }
            navigate("/todo");
          } else toast.error(res.data.message);
        })
        .catch((err) => {
          console.error(err);
          toast.error(
            `${
              err.response.data.message
                ? err.response.data.message
                : "Error in logging the user"
            }`
          );
        });
    },
    validateOnBlur: false,
    validateOnChange: validation,
    validationSchema: yup.object({
      email: yup.string().trim().required("Email is required"),
      password: yup.string().trim().required("Password is required"),
    }),
  });

  return (
    <>
      <div className="relative min-h-screen">
        <img
          src={backgroundTodo}
          alt="backgroundTodo"
          className="relative h-screen w-full"
        />
        <div className="absolute inset-0 flex items-center justify-end pr-20">
          <div className="bg-white p-6 rounded-md w-full max-w-sm shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">
              LOGIN
            </h2>
            <form
              onSubmit={(event) => {
                setValidation(true);
                event.preventDefault();
                formik.handleSubmit();
              }}
            >
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block font-medium mb-1 text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={formik.handleChange}
                  onBlur={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email && (
                  <p className="text-red-600 error self-start text-xs mt-1">
                    {formik.errors.email}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block font-medium mb-1 text-gray-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div
                  className={`relative  text-gray-600 rounded-lg outline-none bg-white focus:bg-white`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    name="password"
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={formik.handleChange}
                    onBlur={formik.handleChange}
                    value={formik.values.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute rounded-full p-1 mt-1.5 cursor-pointer blue-text right-1`}
                  >
                    {showPassword ? (
                      <Eye className="w-5 h-5" />
                    ) : (
                      <EyeOff className="w-5 h-5" />
                    )}
                  </button>
                  {formik.errors.password && (
                    <p className="text-red-600 error self-start text-xs mt-1">
                      {formik.errors.password}
                    </p>
                  )}
                </div>
                <div className="text-sm py-2 px-2 cursor-pointer float-right underline">
                  Forgot Password
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition duration-200"
              >
                Login
              </button>
              <div className="mt-4 text-center">
                {/* Open Telegram manually with icon */}
                <a
                  href={`https://t.me/${telegramUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <Send size={18} />
                  <span>Link to Telegram</span>
                </a>
              </div>
              <div className="flex justify-center items-center mt-4">
                <div className="flex gap-x-2">
                  <h5>New Here?</h5>
                  <Link to="/signup" className="text-blue-500 underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
