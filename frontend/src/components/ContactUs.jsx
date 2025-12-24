import { useState } from "react";
import axios from "axios";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await axios.post(
        "http://127.0.0.1:8000/legal/api/contact-us/",
        formData
      );
      setSuccess("Message sent successfully!");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0b4a7d] min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* HERO TEXT */}
        <div className="bg-white/60 rounded-xl p-6 mb-14 max-w-xl">
          <h1 className="text-2xl font-semibold text-[#0b4a7d]">
            Connect with Our Team
          </h1>
          <p className="text-gray-600 mt-1">
            You can connect to your goals from our website.
          </p>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col md:flex-row gap-10">

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl p-8 w-full md:w-1/2"
          >
            <h2 className="text-xl font-semibold mb-6">Get In Touch</h2>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-3 mb-4"
            />

            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-4 py-3 mb-4"
              required
            />

            <button
              disabled={loading}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

            {success && <p className="text-green-600 mt-3">{success}</p>}
            {error && <p className="text-red-600 mt-3">{error}</p>}
          </form>

          {/* CONTACT INFO */}
          <div className="w-full md:w-1/2 text-white">
            <h2 className="text-xl font-semibold mb-2">Contact us</h2>
            <p className="text-white/80 mb-6">
              You can contact us to find out the contents you want to know as
              soon as possible
            </p>

            <InfoCard title="Address" value="Zi Za War 1 St." />
            <InfoCard title="Mobile" value="+00 635847487" />
            <InfoCard title="Email" value="Email123@gmail.com" />
          </div>

        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div className="border border-white/40 rounded-xl p-5 mb-4">
      <p className="font-medium">{title}</p>
      <p className="text-white/80">{value}</p>
    </div>
  );
}
