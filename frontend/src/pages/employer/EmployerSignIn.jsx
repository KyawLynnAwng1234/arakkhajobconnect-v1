import React, { useState, useEffect } from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { useEmployerAuth } from "../../hooks/useEmployerAuth";
import logo from "../../assets/images/logo.png";
import signPhoto from "../../assets/images/signphoto.png";
import usePageTitle from "../../hooks/usePageTitle";

const EmployerSignIn = () => {
  usePageTitle("Employer Sign-In");
  const { signin } = useEmployerAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await signin({ email, password });
      navigate("/employer/dashboard");
    } catch (err) {
      if (err.response?.status === 400) {
        setError("This account is not registered yet. Please register first.");
      } else {
        setError(err.message || "Sign In failed!");
      }
    } finally {
      setLoading(false);
    }
  };

  // auto-hide error after 3 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-darkblue">
            <img
              src={logo}
              alt="JobSeeker Logo"
              className="h-13 object-contain"
            />
          </NavLink>
        </div>
      </header>

      <div className="bg-white w-full min-h-screen flex">
        <div className="container mx-auto px-4 flex justify-center lg:justify-between items-center space-x-20">
          <div className="hidden lg:block">
            <img src={signPhoto} alt="" />
          </div>

          <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8 text-center">
            <p className="text-darkblue mb-2">
              Are you looking for{" "}
              <Link to="/sign-in" className="text-blue-600 hover:underline">
                a job?
              </Link>
            </p>
            <h2 className="text-2xl font-bold mb-6 text-darkblue">
              Sign In as an employer
            </h2>

            {/* Error message */}
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

            <form className="space-y-4 text-left" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1 text-darkblue">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-yellowbutton text-darkblue rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-darkblue">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-yellowbutton text-darkblue rounded-lg focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end text-sm">
                <Link
                  to="/employer/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  Forget Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full text-darkblue py-3 rounded-lg text-lg font-medium transition duration-300 ease-in-out cursor-pointer ${
                  loading
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                    : "bg-yellowbutton hover:bg-hoveryellowbutton hover:text-darkblue-hover"
                }`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-sm text-darkblue mt-4">
              Already have your account?{" "}
              <Link
                to="/employer/register"
                className="text-blue-600 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 right-0 left-0 h-12 flex items-center justify-center border-t border-gray-200 text-md text-gray-500">
        © 2023 Copyright: Jobstreet .com
      </footer>
    </div>
  );
};

export default EmployerSignIn;
