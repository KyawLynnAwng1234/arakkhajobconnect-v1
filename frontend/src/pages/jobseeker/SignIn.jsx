import React, { useState, useEffect } from "react";
import { FaFacebook } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import logo from "../../assets/images/logo.png";
import signPhoto from "../../assets/images/signphoto.png";
import usePageTitle from "../../hooks/usePageTitle";

const SignIn = () => {
  usePageTitle("Sing-In");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { loading, message, signIn } = useAuth();
  const navigate = useNavigate();

  const allowedDomains = ["gmail.com", "outlook.com"];

  const validateEmail = (email) => {
    // basic email format check
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return false;

    // check domain
    const domain = email.split("@")[1].toLowerCase();
    return allowedDomains.includes(domain);
  };

  const handleSignIn = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    } else if (!validateEmail(email)) {
      setError(
        "Please enter a valid email address with allowed domain (gmail.com, outlook.com)"
      );
      return;
    } else {
      setError("");
    }

    try {
      await signIn(email, navigate);
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

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
              Are you looking for an{" "}
              <Link
                to="/employer/sign-in"
                className="text-blue-600 hover:underline"
              >
                employer?{" "}
              </Link>
            </p>
            <h2 className="text-2xl font-bold mb-6 text-darkblue">
              Sign In as a JobSeeker
            </h2>

            <label
              htmlFor="email"
              className="flex text-sm font-medium mb-1 text-darkblue"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSignIn();
                }
              }}
              placeholder="Email Address"
              className={`w-full mb-1 px-4 py-3 border text-darkblue rounded-lg focus:outline-none ${
                error
                  ? "border-red-500 focus:ring-red-500"
                  : "border-yellowbutton"
              }`}
            />

            {/* Error message only appears after clicking sign in */}
            {error && <p className="text-red-500 text-md mb-4">{error}</p>}

            <button
              onClick={handleSignIn}
              disabled={loading}
              className={`w-full mt-4 py-3 rounded-lg text-lg font-medium transition cursor-pointer ${
                loading
                  ? "bg-gray-400 text-gray-600 cursor-not-allowed opacity-50"
                  : "bg-yellowbutton hover:bg-hoveryellowbutton text-darkblue hover:text-darkblue-hover"
              }`}
            >
              {loading ? "Sending..." : "Email me sign in code"}
            </button>

            {/* Social Buttons */}
            <div className="flex items-center my-6 text-md text-gray-600">
              <hr className="flex-grow border-grayblack" />
              <span className="mx-3 whitespace-nowrap text-darkblue">
                Or another continue With
              </span>
              <hr className="flex-grow border-grayblack" />
            </div>

            <button className="w-full mb-3 flex items-center justify-center gap-2 border border-yellowbutton rounded-lg py-3 hover:bg-graywhite  transition duration-300 ease-in-out shadow-sm cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                className="google-icon"
              >
                <path
                  d="M22.56 12.238c0-.783-.07-1.542-.204-2.28H12.02v4.316h6.05c-.266 1.455-1.047 2.68-2.28 3.518v2.812h3.627c2.126-1.956 3.35-4.83 3.35-8.366z"
                  fill="#4285f4"
                />
                <path
                  d="M12.02 23c2.815 0 5.176-.927 6.895-2.518l-3.628-2.812c-.99.66-2.257 1.055-3.267 1.055-2.502 0-4.636-1.688-5.385-3.958H2.74v2.898A11.964 11.964 0 0012.02 23z"
                  fill="#34a853"
                />
                <path
                  d="M6.635 15.65c-.13-.41-.202-.843-.202-1.298s.072-.888.202-1.297V9.756H2.74a11.963 11.963 0 000 7.488l3.895-1.604z"
                  fill="#fbbc05"
                />
                <path
                  d="M12.02 6.012c1.785 0 3.395.617 4.654 1.796L19.46 4.96c-1.644-1.506-3.89-2.457-6.908-2.457C9.206 2.503 6.845 3.43 5.126 5.021L8.98 7.919c.75-2.27 2.884-3.958 5.386-3.958z"
                  fill="#ea4335"
                />
              </svg>
              <span className="font-medium text-darkblue hover:text-darkblue-hover">
                Continue with Google
              </span>
            </button>

            <button className="w-full flex items-center justify-center gap-2 border border-yellowbutton rounded-lg py-3 hover:bg-graywhite transition duration-300 cursor-pointer shadow-sm">
              <FaFacebook size={20} color="#1877F2" />
              <span className="font-medium text-darkblue hover:text-darkblue-hover">
                Continue with Facebook
              </span>
            </button>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 right-0 h-12 flex items-center justify-center border-t border-gray-200 text-md text-gray-500">
        © 2023 Copyright: Jobstreet .com
      </footer>
    </div>
  );
};

export default SignIn;
