import { useState, useEffect } from "react";
import axios from "axios";
import {
  AlertTriangle,
  Briefcase,
  CheckCircle,
  FileText,
  LayoutGrid,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Overview() {
  const navigate = useNavigate();

  // Initialize the state for dashboard statistics
  const [stats, setStates] = useState([
    {
      title: "Total Job",
      value: 100,
      icon: <Briefcase />,
      color: "border-blue-500",
    },
    {
      title: "Applications",
      value: 150,
      icon: <FileText />,
      color: "border-blue-500",
    },
    {
      title: "Acitve Jobs",
      value: 100,
      icon: <CheckCircle />,
      color: "border-blue-500",
    },
    { title: "Expired Jobs", value: 100, icon: <AlertTriangle /> },
  ]);

  // Vite API_URL
  const API_URL = import.meta.env.VITE_API_URL;

  // Fetch dashboard statistics from API when component mounts
  useEffect(() => {
    const fatchData = async () => {
      try {
        // Make GET request to employer dashboard endpoint
        const res = await axios.get(
          `${API_URL}/accounts-employer/employer/dashboard/`,
          {
            withCredentials: true,
          }
        );

        // Update the stats state with real data from API
        setStates([
          {
            title: "Total Job",
            value: res.data.total_jobs,
            icon: <Briefcase />,
            color: "border-blue-500",
          },
          {
            title: "Applications",
            value: res.data.total_applications,
            icon: <FileText />,
            color: "border-blue-500",
          },
          {
            title: "Active Jobs",
            value: res.data.active_jobs,
            icon: <CheckCircle />,
          },
          {
            title: "Expried Jobs",
            value: res.data.expired_jobs,
            icon: <AlertTriangle />,
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      }
    };

    fatchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center border border-graywhite bg-graycustom/20 px-6 py-5 rounded-2xl shadow-xl my-10">
        <div>
          <h3 className="text-xl text-darkblue font-semibold">
            Dashboard Overview
          </h3>
          <p className="text-base text-darkblue">
            Welcome back, Employer Here’s what’s happening with your jobs.
          </p>
        </div>
        <button
          onClick={() => navigate("/employer/dashboard/job-create")}
          className="px-5 py-3 rounded-xl max-md:text-base text-lg bg-yellowbutton text-darkblue font-semibold hover:bg-hoveryellowbutton hover:text-darkblue-hover transition shadow-md cursor-pointer"
        >
          + Create New Job
        </button>
      </div>

      <div className="my-10 pt-3">
        <h1 className="text-xl font-semibold text-darkblue">
          Statistics Overview
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-3">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="bg-white/30 px-6 py-8 border border-darkblue/10 rounded-xl shadow-md flex justify-between items-center"
            >
              <div className="flex flex-col items-center space-y-2">
                <h2 className="font-semibold text-grayblack">{item.title}</h2>
                <p className="text-xl font-bold text-grayblack">{item.value}</p>
              </div>
              <div
                className={`p-2 rounded-md border border-yellowbutton ${item.color} mb-2`}
              >
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="my-10 pt-3">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h1 className="text-xl font-semibold text-darkblue">
              Notifications
            </h1>
            <div className="py-3">
              <div className="bg-white/30 p-6 border border-darkblue/10 rounded-xl shadow-md flex flex-col items-start gap-6">
                <p>New Job availabel</p>

                <button className="text-darkblue underline font-semibold">
                  View all Notifications
                </button>
              </div>
            </div>
          </div>

          <div>
            <h1 className="text-xl font-semibold text-darkblue">
              Recent Activity
            </h1>
            <div className="py-3">
              <div className="bg-white/30 p-6 border border-darkblue/10 rounded-xl shadow-md flex flex-col items-start gap-6">
                <p>New Job availabel</p>

                <button className="text-darkblue underline font-semibold">
                  View All Activity
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
