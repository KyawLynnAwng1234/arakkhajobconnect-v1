import React, { useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import contactus from "../assets/images/contactus.jpg";
import usePageTitle from "../hooks/usePageTitle";

/* =========================
   CSRF TOKEN HELPER
========================= */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.startsWith(name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const ContactUs = ({ collapse }) => {

  usePageTitle('Contact Us')

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const csrftoken = getCookie("csrftoken");

    try {
      await axios.post(
        "http://127.0.0.1:8000/legal/api/contact-us/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          withCredentials: true,
        }
      );

      setSuccess("Message sent successfully ✅");
      setFormData({
        full_name: "",
        email: "",
        subject: "",
        phone: "",
        message: "",
      });
    } catch (err) {
      setError(err.response?.data || { error: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* ================= HERO ================= */}
      <div
        className={`relative bg-cover bg-center bg-no-repeat transition-all duration-500 overflow-hidden ${
          collapse
            ? "h-0 py-0 opacity-0"
            : "h-[530px] max-2xl:h-[350px] max-xl:h-[320px] max-lg:h-[300px] py-8 opacity-100"
        }`}
        style={{
          backgroundImage: `url(${contactus})`,
        }}
      >
        <div className="container mx-auto px-4 absolute mb-10 bottom-0 right-0 left-0">
          <div className="border border-transparent rounded-2xl bg-white/90 backdrop-blur-md py-3 px-5 flex flex-col justify-center">
            <h1 className="text-3xl text-darkblue">Connect with Our Team</h1>
            <p className="text-darkblue/70">
              You can connect to your goals from our website
            </p>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">
          {/* ===== LEFT : FORM ===== */}
          <div className="bg-darkblue/90 rounded-2xl shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6 text-graywhite">
              Get In Touch
            </h2>

            {/* ERROR */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {Object.entries(error).map(([key, value]) => (
                  <p key={key}>
                    <strong>{key}:</strong>{" "}
                    {Array.isArray(value) ? value[0] : value}
                  </p>
                ))}
              </div>
            )}

            {/* SUCCESS */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="full_name"
                placeholder="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full border border-yellowbutton rounded-lg px-4 py-3 text-graywhite focus:outline-none"
              />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border border-yellowbutton rounded-lg px-4 py-3 text-graywhite focus:outline-none"
              />

              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full border border-yellowbutton rounded-lg px-4 py-3 text-graywhite bg-graywhite/10 focus:outline-none"
              >
                <option value="" className="bg-darkblue text-graywhite">
                  Select Subject
                </option>
                <option value="general" className="bg-darkblue text-graywhite">
                  General Inquiry
                </option>
                <option value="job" className="bg-darkblue text-graywhite">
                  Job Related
                </option>
                <option value="employer" className="bg-darkblue text-graywhite">
                  Employer Support
                </option>
                <option
                  value="technical"
                  className="bg-darkblue text-graywhite"
                >
                  Technical Issue
                </option>
                <option value="other" className="bg-darkblue text-graywhite">
                  Other
                </option>
              </select>

              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="w-full border border-yellowbutton rounded-lg px-4 py-3 text-graywhite focus:outline-none"
              />

              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full border border-yellowbutton rounded-lg px-4 py-3 text-graywhite focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className="max-md:h-[40px] max-xl:h-[48px] h-[55px] px-5 rounded-xl max-md:text-base text-lg bg-yellowbutton text-darkblue font-semibold hover:bg-hoveryellowbutton hover:text-darkblue-hover transition shadow-md cursor-pointer"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* ===== RIGHT : CONTACT INFO ===== */}
          <div className="text-darkblue">
            <h2 className="text-2xl font-semibold mb-3">Contact us</h2>
            <p className="text-darkblue mb-6">
              You can contact us to find out the contents you want to know as
              soon as possible
            </p>

            <div className="space-y-4">
              <div className="border border-yellowbutton rounded-xl p-5">
                <p className="font-semibold flex gap-2 items-center">
                  <FaMapMarkerAlt size={20} className="fill-darkblue" />{" "}
                  <span className="text-darkblue">Address</span>
                </p>
                <p className="text-darkblue">Arakkha PaukTaw</p>
              </div>

              <div className="border border-yellowbutton rounded-xl p-5">
                <p className="font-semibold flex gap-2 items-center">
                  <FaPhoneAlt size={20} className="fill-darkblue" />{" "}
                  <span className="text-darkblue">Mobile</span>
                </p>
                <p className="text-darkblue">+00 635847487</p>
              </div>

              <div className="border border-yellowbutton rounded-xl p-5">
                <p className="font-semibold flex gap-2 items-center">
                  <FaEnvelope size={20} className="fill-darkblue" />{" "}
                  <span className="text-darkblue">Email</span>
                </p>
                <p className="text-darkblue">futter343@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
