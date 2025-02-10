import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, KeySquare, AlertCircle } from "lucide-react";
import HealthLogo from "./assets/Health.svg";
import { loginUser, registerUser, verifyOTP } from "../services/api";
import PropTypes from "prop-types";

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otpData, setOTPData] = useState({
    email: "",
    otp: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    password: "",
    userType: "owner",
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await loginUser(loginData.email, loginData.password);
      // Store both authentication status and user data
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData)); // Add this line
      navigate("/dashboard");
    } catch (error) {
      setError(error.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await registerUser({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        userType: registerData.userType,
      });

      if (response.requiresVerification) {
        setOTPData({ email: registerData.email, otp: "" });
        setShowOTPVerification(true);
      } else {
        // Handle normal registration success
        setIsLogin(true);
        setLoginData({
          email: registerData.email,
          password: registerData.password,
        });
      }
      setError("");
    } catch (error) {
      setError(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Add OTP verification handler
  const handleOTPVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await verifyOTP(otpData);
      // Store authentication data after successful verification
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(response));

      setShowOTPVerification(false);
      setIsLogin(true);
      navigate("/dashboard"); // Navigate directly to dashboard after verification
    } catch (error) {
      setError(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Error message component
  const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
      <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600 mb-4">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm">{message}</span>
      </div>
    );
  };

  ErrorMessage.propTypes = {
    message: PropTypes.string,
  };

  // Optional: Add default props
  ErrorMessage.defaultProps = {
    message: "",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 font-poppins">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-2xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-3xl h-[600px] bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
        {/* Static container for forms */}
        <div className="absolute inset-0 grid grid-cols-2">
          {/* Login Form */}
          <div
            className={`p-12 transition-opacity duration-700 ${
              isLogin ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <div className="mb-8">
              <KeySquare className="h-12 w-12 text-cyan-500 mb-4" />
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Welcome Back
              </h2>
              <p className="text-gray-600">Please login to your account</p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <ErrorMessage message={error} />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span className="ml-2 text-gray-600">Remember me</span>
                </label>

                <button
                  onClick={() => navigate("/forgot-password")}
                  className="text-cyan-500 hover:text-blue-500 font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          {/* Register Form */}
          <div
            className={`p-12 transition-opacity duration-700 overflow-y-auto ${
              isLogin ? "opacity-0 z-0" : "opacity-100 z-10"
            }`}
          >
            <div className="mb-8">
              <KeySquare className="h-12 w-12 text-cyan-500 mb-4" />
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                Create Account
              </h2>
              <p className="text-gray-600">Join our community today</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-6 mb-6">
              <ErrorMessage message={error} />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        password: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  User Type
                </label>
                <select
                  value={registerData.userType}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      userType: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
                  required
                >
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Sign up"}
              </button>
            </form>
          </div>
        </div>

        {/* Sliding Welcome Panel */}
        <div
          className={`absolute top-0 h-full w-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 transition-transform duration-700 ease-in-out ${
            isLogin ? "translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="relative h-full p-12 text-white flex flex-col items-center justify-center text-center">
            {/* Decorative circles */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-soft-light filter blur-xl opacity-10"></div>
            <div className="absolute bottom-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-soft-light filter blur-xl opacity-10"></div>

            <div className="relative -mt-32">
              {isLogin ? (
                <>
                  <img
                    src={HealthLogo}
                    alt="Health Logo"
                    className="w-48 h-48 mx-auto mb-6"
                  />
                  <h2 className="text-4xl font-bold mb-4">LIFEEC</h2>
                  <p className="mb-8 text-lg text-blue-100">
                    Professional Elderly Care System
                  </p>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="py-3 px-8 rounded-xl border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium"
                  >
                    Sign Up
                  </button>
                </>
              ) : (
                <>
                  <img
                    src={HealthLogo}
                    alt="Health Logo"
                    className="w-48 h-48 mx-auto mb-6"
                  />
                  <h2 className="text-4xl font-bold mb-4">LIFEEC</h2>
                  <p className="mb-8 text-lg text-blue-100">
                    Professional Elderly Care System
                  </p>
                  <button
                    onClick={() => setIsLogin(true)}
                    className="py-3 px-8 rounded-xl border-2 border-white text-white hover:bg-white hover:text-blue-600 transition-all duration-200 font-medium"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* OTP Verification Form */}
      {showOTPVerification && (
        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Verify Your Account
            </h3>
            <p className="text-gray-600 mb-6">
              Please enter the verification code sent to your email.
            </p>

            <form onSubmit={handleOTPVerify} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otpData.otp}
                  onChange={(e) =>
                    setOTPData({ ...otpData, otp: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-blue-700 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
