import { useEffect, useState } from "react";
import axios from "axios";
import aboutus from "../assets/images/aboutus.jpg";
import usePageTitle from "../hooks/usePageTitle";

const API_URL = import.meta.env.VITE_API_URL;

export default function AboutUs({ collapse }) {
  usePageTitle("About Us");

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
      <div className="container mx-auto py-20 px-4 text-center text-grayblack">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-20 px-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={`relative bg-cover bg-center bg-no-repeat transition-all duration-500 overflow-hidden ${
          collapse
            ? "h-0 py-0 opacity-0"
            : "h-[530px] max-2xl:h-[350px] max-xl:h-[320px] max-lg:h-[300px] py-8 opacity-100"
        }`}
        style={{
          backgroundImage: `url(${aboutus})`,
        }}
      ></div>

      <div className="container mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6 text-darkblue">{about.title}</h1>

        {/* CKEditor HTML content */}
        <div
          className="text-base leading-7 text-darkblue/90 max-w-none"
          dangerouslySetInnerHTML={{ __html: about.content }}
        />

        {about.mission_statement && (
          <div className="mt-10">
            <div>
              <h2 className="text-2xl font-semibold mb-3 text-darkblue">Our Mission</h2>
              <div
                className="text-base leading-7 text-darkblue/90 max-w-none"
                dangerouslySetInnerHTML={{
                  __html: about.mission_statement,
                }}
              />
            </div>
          </div>
        )}

        {about.vision_statement && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-3 text-darkblue">Our Vision</h2>
            <div
              className="text-base leading-7 text-darkblue/90 max-w-none"
              dangerouslySetInnerHTML={{
                __html: about.vision_statement,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
