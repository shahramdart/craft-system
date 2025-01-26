import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoginUser, reset } from "../features/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [alertMessage, setAlertMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isError, isSuccess, isLoading, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    return () => {
      dispatch(reset());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user || isSuccess) {
      navigate("/dashboard");
    }
  }, [user, isSuccess, navigate]);

  const Auth = (e) => {
    e.preventDefault();
    if (!email && !password) {
      setAlertMessage("تکایە هەردوو ئیمەیڵ و وشەی نهێنی پڕبکەرەوە");
    } else if (!email) {
      setAlertMessage("تکایە ئیمەیڵەکەت بنووسە");
    } else if (!password) {
      setAlertMessage("تکایە وشەی نهێنی خۆت دابنێ");
    } else {
      setAlertMessage("");
      dispatch(LoginUser({ email, password }));
    }
  };

  return (
    <section
      dir="ltr"
      className="flex items-center justify-center min-h-screen bg-gray-100"
    >
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        {alertMessage && (
          <div
            id="alert-4"
            className="flex items-center p-4 mb-4 text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
            role="alert"
          >
            <span className="sr-only">Info</span>
            <div className="ms-3 text-sm font-medium">{alertMessage}</div>
            <button
              type="button"
              className="ms-auto bg-yellow-50 text-yellow-500 rounded-lg p-1.5"
              onClick={() => setAlertMessage("")}
            >
              <span className="sr-only">Close</span>
              &times;
            </button>
          </div>
        )}

        <form onSubmit={Auth}>
          {isError && (
            <p className="text-center text-red-500 mb-4">{message}</p>
          )}
          <h1 className="text-3xl font-semibold text-center mb-6">Sign In</h1>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"} // Toggle input type
                id="password"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*****"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-900 transition duration-300"
          >
            {isLoading ? "Loading ..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
