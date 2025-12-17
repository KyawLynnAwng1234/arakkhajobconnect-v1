import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEmployerAuth } from "../../hooks/useEmployerAuth";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/logo.png";
import usePageTitle from "../../hooks/usePageTitle";
import { Listbox } from "@headlessui/react";

// SVG FLAGS
import mmFlag from "../../assets/flags/mm.svg";
import cnFlag from "../../assets/flags/cn.svg";
import inFlag from "../../assets/flags/in.svg";
import thFlag from "../../assets/flags/th.svg";
import usFlag from "../../assets/flags/us.svg";
import gbFlag from "../../assets/flags/gb.svg";

// ---------------------------------------------
// Country List using SVG icons
// ---------------------------------------------
const COUNTRIES = [
  { code: "+95", name: "Myanmar", flag: mmFlag },
  { code: "+86", name: "China", flag: cnFlag },
  { code: "+91", name: "India", flag: inFlag },
  { code: "+66", name: "Thailand", flag: thFlag },
  { code: "+1", name: "USA", flag: usFlag },
  { code: "+44", name: "UK", flag: gbFlag },
];

export default function EmployerCompanyDetail() {
  usePageTitle("Employer Company Register");

  const location = useLocation();
  const navigate = useNavigate();
  const { submitCompanyDetail } = useEmployerAuth();

  const email = location.state?.email || "you@email.com";
  const password = location.state?.password;

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Country + Phone
  const [countryCode, setCountryCode] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const COMPANY_SIZE_OPTIONS = [
    { value: "1-10", label: "1 – 10 employees" },
    { value: "11-50", label: "11 – 50 employees" },
    { value: "51-200", label: "51 – 200 employees" },
    { value: "201-500", label: "201 – 500 employees" },
    { value: "500+", label: "500+ employees" },
  ];

  // Load user
  useEffect(() => {
    const savedUser = localStorage.getItem("employerUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // ------------------------------
  // PHONE VALIDATION
  // ------------------------------
  const validatePhone = (value, code) => {
    if (code === "+95") return value.length >= 9 && value.length <= 11 ? "" : "Myanmar phone must be 9–11 digits.";
    if (code === "+86") return value.length === 11 ? "" : "China phone must be 11 digits.";
    if (code === "+91") return value.length === 10 ? "" : "India phone must be 10 digits.";
    if (code === "+66") return value.length >= 9 && value.length <= 10 ? "" : "Thailand must be 9–10 digits.";
    if (code === "+1") return value.length === 10 ? "" : "USA must be 10 digits.";
    if (code === "+44") return value.length === 10 ? "" : "UK must be 10 digits.";
    return "";
  };

  // ------------------------------
  // SUBMIT HANDLER
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (phoneError) {
      toast.error("Invalid phone number!");
      return;
    }

    setLoading(true);

    try {
      const profile = {
        email,
        password,
        first_name: e.target.first_name.value,
        last_name: e.target.last_name.value,
        business_name: e.target.business_name.value,
        city: e.target.city.value,
        phone: `${countryCode.code}${phone}`,
        size: e.target.size.value,
        website: e.target.website.value,
        industry: e.target.industry.value,
        founded_year: e.target.founded_year.valueAsNumber,
        contact_email: e.target.contact_email.value,
      };

      const formData = new FormData();
      formData.append("profile", JSON.stringify(profile));

      if (e.target.logo.files[0]) {
        formData.append("logo", e.target.logo.files[0]);
      }

      await submitCompanyDetail(formData);

      toast.success("Account created successfully!");
      navigate("/employer/dashboard");
    } catch (err) {
      console.error("Error:", err.response?.data);
      toast.error("Email alreay exit!");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // UI
  // -------------------------------------------
  return (
    <div className="min-h-screen bg-white flex flex-col font-inter">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold text-darkblue">
            <img src={logo} alt="JobSeeker Logo" className="h-13 object-contain" />
          </NavLink>

          <div className="text-gray-700 cursor-pointer">
            {user?.username || user?.email || "Employer"} ▼
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex flex-col items-center py-25">
        <div className="w-full max-w-3xl">
          <h2 className="text-2xl font-bold mb-2">Your Employer Account</h2>
          <p className="text-gray-600 mb-4">
            You're almost done! Fill in company information to complete setup.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <p className="w-full px-3 py-2 bg-gray-100">{email}</p>
            </div>

            {/* Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">First Name</label>
                <input name="first_name" className="w-full border rounded-lg px-3 py-2" required />
              </div>

              <div>
                <label className="block text-sm font-medium">Last Name</label>
                <input name="last_name" className="w-full border rounded-lg px-3 py-2" required />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input name="business_name" className="w-full border rounded-lg px-3 py-2" required />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <input name="city" className="w-full border rounded-lg px-3 py-2" required />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium">Phone</label>

              <div className="flex gap-3 items-center">
                {/* SVG FLAG DROPDOWN */}
                <Listbox value={countryCode} onChange={(val) => { setCountryCode(val); setPhone(""); }}>
                  <div className="relative">
                    <Listbox.Button className="border px-3 py-2 rounded-lg w-36 flex items-center gap-2">
                      <img src={countryCode.flag} className="h-5 w-5" />
                      <span>{countryCode.code}</span>
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-1 w-36 bg-white border rounded-lg shadow-lg z-20">
                      {COUNTRIES.map((c) => (
                        <Listbox.Option
                          key={c.code}
                          value={c}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                        >
                          <img src={c.flag} className="h-5 w-5" />
                          <span>{c.code}</span>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                </Listbox>

                {/* Phone Input */}
                <input
                  name="phone"
                  value={phone}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "");
                    setPhone(v);
                    setPhoneError(validatePhone(v, countryCode.code));
                  }}
                  className="flex-1 border rounded-lg px-3 py-2"
                  placeholder="0979001122"
                  required
                />
              </div>

              {phoneError && <p className="text-red-500 text-sm mt-1">{phoneError}</p>}
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium">Website</label>
              <input name="website" className="w-full border rounded-lg px-3 py-2" required />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium">Industry</label>
              <input name="industry" className="w-full border rounded-lg px-3 py-2" required />
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-medium">Company Size</label>
              <select name="size" className="w-full border rounded-lg px-3 py-2" required>
                <option value="">Select size</option>
                {COMPANY_SIZE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Founded Year */}
            <div>
              <label className="block text-sm font-medium">Founded Year</label>
              <input
                name="founded_year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* Contact Email */}
            <div>
              <label className="block text-sm font-medium">Contact Email</label>
              <input name="contact_email" type="email" className="w-full border rounded-lg px-3 py-2" required />
            </div>

            {/* Logo */}
            <div>
              <label className="block text-sm font-medium">Company Logo</label>
              <input name="logo" type="file" accept="image/*" className="w-full border rounded-lg px-3 py-2" />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || phoneError}
              className={`px-6 py-2 rounded-lg font-medium text-white transition ${
                loading || phoneError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              {loading ? "Creating..." : "Create New Account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
