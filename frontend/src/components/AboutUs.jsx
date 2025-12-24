import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AboutUs() {
  const [about, setAbout] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/legal/api/about-us/`)
      .then((res) => {
        setAbout(res.data);
        setError("");
      })
      .catch((err) => {
        // Show the backend response as it is on the frontend
        if (err.response?.data?.detail) {
          setError(err.response.data.detail);
        } else {
          setError("Something went wrong.");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-grayblack">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">{about.title}</h1>

      {/* CKEditor HTML content */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: about.content }}
      />

      {about.mission_statement && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Our Mission</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: about.mission_statement,
            }}
          />
        </div>
      )}

      {about.vision_statement && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-3">Our Vision</h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
              __html: about.vision_statement,
            }}
          />
        </div>
      )}
    </div>
  );
}
