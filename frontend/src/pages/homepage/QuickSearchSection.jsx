import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Static column (Other only)
const quickSearchData = [
  {
    heading: "Other",
    items: ["All Jobs", "Admin Jobs", "Admin Jobs"],
  },
];

export default function QuickSearchSection() {
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFromJobs = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://127.0.0.1:8000/job/jobs/");
        const jobs = res.data.jobs || [];

        // Categories
        const categoryMap = new Map();
        jobs.forEach((job) => {
          if (job.category && job.category_name) {
            categoryMap.set(job.category, {
              id: job.category,
              name: job.category_name,
            });
          }
        });

        setCategories(Array.from(categoryMap.values()));

        // Major Cities 
        const cityMap = new Map();
        jobs.forEach((job) => {
          if (job.location && job.location_display) {
            cityMap.set(job.location, {
              code: job.location,
              name: job.location_display,
            });
          }
        });

        setCities(Array.from(cityMap.values()));
      } catch (err) {
        console.error("QuickSearch load error:", err);
        setCategories([]);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFromJobs();
  }, []);

  return (
    <section className="border-t py-8">
      <div className="container mx-auto px-4">
        <div className="py-6 text-center">
          <h2 className="text-grayblack text-2xl font-bold">Quick Search</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Classifications */}
          <div>
            <h4 className="font-semibold text-grayblack">Classifications</h4>

            <ul className="flex flex-row gap-5 flex-wrap my-4">
              {loading && <li>Loading...</li>}

              {!loading &&
                categories.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() =>
                        navigate("/job-search/all", {
                          state: {
                            categoryId: category.id,
                            categoryName: category.name,
                          },
                        })
                      }
                      className="text-darkblue hover:text-darkblue-hover hover:underline cursor-pointer"
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Major City */}
          <div>
            <h4 className="font-semibold text-grayblack">Major City</h4>

            <ul className="flex flex-row gap-5 flex-wrap my-4">
              {loading && <li>Loading...</li>}

              {!loading &&
                cities.map((city) => (
                  <li key={city.code}>
                    <button
                      onClick={() =>
                        navigate("/job-search/all", {
                          state: {
                            location: city.code,
                            locationName: city.name,
                          },
                        })
                      }
                      className="text-darkblue hover:text-darkblue-hover hover:underline cursor-pointer"
                    >
                      {city.name}
                    </button>
                  </li>
                ))}
            </ul>
          </div>

          {/* Other */}
          {quickSearchData.map((col, index) => (
            <div key={index}>
              <h4 className="font-semibold text-grayblack">{col.heading}</h4>

              <ul className="flex flex-row gap-5 flex-wrap my-4">
                {col.items.map((item, i) => (
                  <li key={i}>
                    <a href="#" className="text-darkblue hover:underline">
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
