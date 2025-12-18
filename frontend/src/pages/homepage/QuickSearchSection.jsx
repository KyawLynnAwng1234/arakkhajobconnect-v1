import React, { useEffect, useState } from "react";
import axios from "axios";

// Static columns
const quickSearchData = [
  {
    heading: "Major City",
    items: ["Kyaunkpyu", "Myauk U", "Taungup", "Ann"],
  },
  {
    heading: "Other",
    items: ["All Jobs", "Admin Jobs", "Admin Jobs"],
  },
];

export default function QuickSearchSection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔐 CSRF helper (INSIDE component)
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

        const csrftoken = getCookie("csrftoken");

        const res = await axios.get(
          "http://127.0.0.1:8000/job/job-categories/",
          {
            withCredentials: true, // ⭐ session cookie
            headers: {
              "X-CSRFToken": csrftoken, // ⭐ csrf token
            },
          }
        );

        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="border-t py-8">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="py-6 text-center">
          <h2 className="text-grayblack text-2xl font-bold">Quick Search</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Classifications (API) */}
          <div>
            <h4 className="font-semibold text-grayblack">Classifications</h4>

            <ul className="flex flex-row gap-5 flex-wrap my-4">
              {loading && <li className="text-gray-400">Loading...</li>}

              {!loading &&
                categories.map((category) => (
                  <li key={category.id}>
                    <a
                      href={`/jobs?category=${category.id}`}
                      className="text-darkblue hover:text-darkblue-hover hover:underline"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
            </ul>
          </div>

          {/* Static columns */}
          {quickSearchData.map((col, index) => (
            <div key={index}>
              <h4 className="font-semibold text-grayblack">{col.heading}</h4>

              <ul className="flex flex-row gap-5 flex-wrap my-4">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <a
                      href="#"
                      className="text-darkblue hover:text-darkblue-hover hover:underline"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
