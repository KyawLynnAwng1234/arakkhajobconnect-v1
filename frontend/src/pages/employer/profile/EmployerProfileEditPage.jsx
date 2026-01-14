import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

// CSRF token function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

export default function EmployerProfileEditPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { profile } = location.state || {};

  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    business_name: profile?.business_name || "",
    city: profile?.city || "",
    website: profile?.website || "",
    industry: profile?.industry || "",
    phone: profile?.phone || "",
    size: profile?.size || "",
    founded_year: profile?.founded_year || "",
    contact_email: profile?.contact_email || "",
    logo: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  // variables csrfToken
  const csrfToken = getCookie("csrftoken");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.id) return console.error("Profile ID not found!");

    const token = localStorage.getItem("access");
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) data.append(key, value);
    });

    try {
      const res = await axios.put(
        `${API_URL}/accounts-employer/employer/profile-update/${profile.id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );
      console.log("Update response:", res.data);
      navigate("/employer/dashboard/profile");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white/30 shadow-xl rounded-xl p-6 w-full"
        >
          <h2 className="text-xl text-darkblue font-bold text-center">
            Edit Employer Profile
          </h2>

          {/* Logo preview */}
          <div className="flex flex-col items-center py-6">
            {profile?.logo && (
              <img
                src={
                  profile.logo.startsWith("http")
                    ? profile.logo
                    : `${API_URL}${profile.logo}`
                }
                alt="Company Logo"
                className="w-24 h-24 rounded-full object-cover mb-3 border shadow-sm"
              />
            )}
            <label className="text-sm font-medium text-grayblack/60 mb-1">
              Upload Company Logo
            </label>
            <input
              type="file"
              name="logo"
              accept="image/*"
              onChange={handleChange}
              className="border border-grayblack/30 p-2 rounded w-64 text-sm file:mr-3 file:px-3 file:py-2 file:rounded-md file:border-0 file:bg-yellowbutton file:text-darkblue hover:file:bg-hoveryellowbutton hover:file:text-darkblue-hover cursor-pointer transition duration-300 ease-in-out"
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-darkblue mb-1">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className="w-full border border-grayblack/30 rounded-md p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-darkblue mb-1">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-medium text-darkblue mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-darkblue mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-darkblue mb-1">
                Website
              </label>
              <input
                type="text"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-darkblue mb-1">
                Industry
              </label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-darkblue mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-darkblue mb-1">
                Company Size
              </label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-darkblue mb-1">
                Founded Year
              </label>
              <input
                type="number"
                name="founded_year"
                value={formData.founded_year}
                onChange={handleChange}
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-medium text-darkblue mb-1">
                Contact Email
              </label>
              <input
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                className="w-full border border-grayblack/30 text-darkblue rounded-md p-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2 border border-darkblue text-darkblue rounded-md hover:text-darkblue-hover transition duration-300 ease-in-out cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 border border-transparent bg-yellowbutton text-darkblue font-medium rounded-md shadow hover:bg-hoveryellowbutton hover:text-darkblue-hover transition duration-300 ease-in-out cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
