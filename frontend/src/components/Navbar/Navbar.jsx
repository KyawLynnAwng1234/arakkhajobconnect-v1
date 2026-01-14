import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User, Bookmark, FileText, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useEmployerAuth } from "../../hooks/useEmployerAuth";
import logo from "../../assets/images/logo.png";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile menu state
  const [dropdownOpen, setDropdownOpen] = useState(false); // User dropdown state
  const dropdownRef = useRef(null);
  const { user, loading, logout } = useAuth();
  const { employer, authLoading: employerLoading } = useEmployerAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  useEffect(() => {
    if (!loading && user) {
      // Optional: console.log("Navbar user:", user);
    }
  }, [user, loading]);

  // Nav Links
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Jobs", path: "/job-search" },
    { name: "Companies", path: "/companies" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <>
      {/* Navbar header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-darkblue">
            <img
              src={logo}
              alt="JobSeeker Logo"
              className="h-13 object-contain"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <NavLink
                key={index}
                to={link.path}
                className={({ isActive }) =>
                  `relative group pb-1 transition-colors duration-300
        ${
          isActive
            ? "text-darkblue font-semibold"
            : "text-grayblack hover:text-darkblue"
        }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}

                    {/* animated bottom border */}
                    <span
                      className={`absolute left-0 -bottom-[2px] h-[2px] w-full bg-darkblue
              origin-left transform
              transition-transform duration-300 ease-out
              ${
                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`}
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Side Desktop */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {!user && !loading ? (
              employer ? (
                <NavLink
                  to="/employer/dashboard"
                  className="text-darkblue hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                >
                  Employer Dashboard
                </NavLink>
              ) : (
                <>
                  <NavLink
                    to="/sign-in"
                    className="text-darkblue border rounded-md py-[2px] px-2 hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/employer/sign-in"
                    className="text-darkblue hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                  >
                    Employer SignUp
                  </NavLink>
                </>
              )
            ) : (
              <>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="text-darkblue hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue flex items-center gap-1 cursor-pointer"
                  >
                    {loading
                      ? "Loading..."
                      : user?.name ||
                        user?.username ||
                        user?.email?.split("@")[0] ||
                        "Account"}{" "}
                    ▼
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 border border-darkblue/50 rounded-lg shadow-lg py-2 z-50 bg-graywhite text-darkblue ">
                      <NavLink
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <User size={16} /> Profile
                      </NavLink>

                      <NavLink
                        to="/job-search/saved"
                        className="flex items-center gap-2 px-4 py-2 hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Bookmark size={16} /> Saved Jobs
                      </NavLink>

                      <NavLink
                        to="/job-search/applications"
                        className="flex items-center gap-2 px-4 py-2 hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FileText size={16} /> Job Applications
                      </NavLink>

                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue cursor-pointer"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>

                <NavLink
                  to="/employer/sign-in"
                  className="text-darkblue hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                >
                  Employer Site
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-darkblue hover:text-darkblue-hover focus:outline-none cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="md:hidden bg-white shadow-md">
            <div className="px-4 py-2 space-y-2">
              {navLinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `relative group block pb-1 transition-colors duration-300
      ${
        isActive
          ? "text-darkblue font-semibold"
          : "text-grayblack hover:text-darkblue hover:text-shadow-2xs hover:shadow-darkblue"
      }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.name}

                      {/* animated bottom border */}
                      <span
                        className={`absolute left-0 -bottom-[2px] h-[2px] w-full bg-darkblue
            origin-left transform
            transition-transform duration-300 ease-out
            ${
              isActive
                ? "scale-x-100"
                : "scale-x-0 group-hover:scale-x-100 group-active:scale-x-100"
            }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}

              <hr />

              {!user && !loading ? (
                employer ? (
                  <NavLink
                    to="/employer/dashboard"
                    className="block text-darkblue hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                    onClick={() => setIsOpen(false)}
                  >
                    Employer Dashboard
                  </NavLink>
                ) : (
                  <>
                    <NavLink
                      to="/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="text-darkblue border rounded-md py-[2px] px-2 hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                    >
                      Sign In
                    </NavLink>
                    <NavLink
                      to="/employer/sign-in"
                      onClick={() => setIsOpen(false)}
                      className="ml-4 text-darkblue hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                    >
                      Employer Site
                    </NavLink>
                  </>
                )
              ) : (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer text-darkblue hover:text-darkblue-hover hover:text-shadow-2xs hover:shadow-darkblue"
                >
                  <LogOut size={16} /> Logout
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      {/* spacing for fixed navbar */}
      <div className="h-14"></div>
    </>
  );
}
