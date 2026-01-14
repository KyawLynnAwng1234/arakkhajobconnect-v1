import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  Clock,
  MapPin,
  MoreVertical,
} from "lucide-react";
import usePageTitle from "../../../hooks/usePageTitle";
import toast from "react-hot-toast";

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

export default function JobApplicationProfileDetail() {
  const { id } = useParams(); // app_id
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const [application, setApplication] = useState(null);
  const [jobseeker, setJobseeker] = useState(null);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [skills, setSkills] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openMenu, setOpenMenu] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Vite API_URL
  const API_URL = import.meta.env.VITE_API_URL;

  const seekerName = jobseeker?.full_name || "Job Application Profile";
  usePageTitle(`${seekerName} | JobSeeker`);

  // STATUS MAP
  const STATUS_MAP = {
    Pending: "P",
    Review: "R",
    Rejected: "RJ",
    Shortlist: "SL",
    Hired: "H",
  };

  const STATUS_LABEL_MAP = {
    P: "Pending",
    R: "Review",
    RJ: "Rejected",
    SL: "Shortlist",
    H: "Hired",
  };

  // CLOSE DROPDOWN ON OUTSIDE
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch All Data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        // Application detail
        const appRes = await axios.get(
          `${API_URL}/application/employer/application/detail/${id}/`
        );
        const appData = appRes.data.s_app;
        setApplication(appData);

        // Jobseeker profile
        if (appData.job_seeker_profile) {
          const seekerId = appData.job_seeker_profile;

          const [profileRes, eduRes, expRes, skillRes, langRes] =
            await Promise.all([
              // profile API
              axios.get(
                `${API_URL}/accounts-jobseeker/jobseekerprofile/${seekerId}/`
              ),
              // education API
              axios.get(
                `${API_URL}/accounts-jobseeker/education/?profile=${seekerId}`
              ),
              // experience API
              axios.get(
                `${API_URL}/accounts-jobseeker/experience/?profile=${seekerId}`
              ),
              // skill API
              axios.get(
                `${API_URL}/accounts-jobseeker/skill/?profile=${seekerId}`
              ),
              // language API
              axios.get(
                `${API_URL}/accounts-jobseeker/language/?profile=${seekerId}`
              ),
            ]);

          setJobseeker(profileRes.data);
          setEducation(eduRes.data);
          setExperience(expRes.data);
          setSkills(skillRes.data);
          setLanguages(langRes.data);
        }
      } catch (error) {
        console.error("❌ Error fetching job application detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  // UPDATE STATUS
  const handleAction = async (label) => {
    const code = STATUS_MAP[label];
    const csrftoken = getCookie("csrftoken");

    if (!code) {
      toast.error("Invalid status", { icon: "ℹ️" });
      return;
    }

    try {
      setUpdating(true);
      setOpenMenu(false);

      await axios.post(
        `${API_URL}/application/applications/${id}/update-status/`,
        { new_status: code },
        {
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(`Status updated to ${label}`);

      // Update local UI
      setApplication((prev) =>
        prev ? { ...prev, status: code, status_display: label } : prev
      );
    } catch (error) {
      console.error("❌ Status update failed:", error);

      const msg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to update status";

      toast.error(msg, {
        icon: "ℹ️",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading...</p>;

  if (!application || !jobseeker)
    return <p className="text-center py-10 text-gray-500">No data found.</p>;

  const job = application.job || {};
  const seeker = jobseeker || {};

  // CURRENT STATUS LABEL
  const currentStatusLabel =
    application.status && application.status !== "P"
      ? STATUS_LABEL_MAP[application.status]
      : "Change Status";

  return (
    <div className="p-6">
      <div className="p-6 bg-white/30 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-darkblue hover:text-darkblue-hover hover:underline"
          >
            <ArrowLeft size={20} className="mr-2" />
            Job Application Profile
          </button>

          {/* STATUS DROPDOWN */}
          <div className="relative" ref={menuRef}>
            <button
              disabled={updating}
              onClick={() => setOpenMenu((p) => !p)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg
                bg-white hover:bg-gray-50 disabled:opacity-50
                ${
                  application.status === "SL"
                    ? "text-green-600 border-green-300"
                    : ""
                }
                ${
                  application.status === "H"
                    ? "text-purple-600 border-purple-300"
                    : ""
                }
                ${
                  application.status === "RJ"
                    ? "text-red-600 border-red-300"
                    : ""
                }
              `}
            >
              {currentStatusLabel}
              <MoreVertical size={18} />
            </button>

            {openMenu && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-36 z-50">
                {["Pending", "Review", "Rejected", "Shortlist", "Hired"].map(
                  (option) => (
                    <button
                      key={option}
                      onClick={() => handleAction(option)}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-blue-50"
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* INFO */}
          <div className="bg-graywhite p-4 rounded-xl">
            <p className="text-sm text-grayblack/70">
              Current Status :{" "}
              <span className="font-semibold">
                {STATUS_LABEL_MAP[application.status]}
              </span>
            </p>
          </div>
        </div>

        {/* Top Info */}
        <div className="bg-graywhite shadow-xl rounded-xl p-6 flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 text-center">
            {/* jobseeker img */}
            <img
              src={
                seeker.profile_picture ||
                "https://via.placeholder.com/120?text=Profile"
              }
              alt="profile"
              className="w-32 h-32 rounded-full mx-auto mb-2 object-cover"
            />
            <h2 className="text-lg font-semibold">{seeker.full_name}</h2>
            {/* <p className="text-sm text-gray-500">
              Jobseeker Id: {seeker.id?.slice(0, 6).toUpperCase() || "—"}
            </p> */}
          </div>

          {/* job info (title, description, salary, location) */}
          <div className="flex-grow">
            <h3 className="text-xl font-semibold text-grayblack">
              {job.title}
            </h3>
            <ul className="list-disc ml-6 text-grayblack/80 text-sm mt-2">
              <li
                dangerouslySetInnerHTML={{
                  __html: job.description || "<i>No description</i>",
                }}
              />
              <li>
                {job.salary ? `${job.salary} Ks` : "Salary not specified"}
              </li>
              <li>{job.location || "No location"}</li>
            </ul>

            {/* jobseeker grid (email, phone, applied_at, location) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm text-grayblack/80">
              <div className="flex items-center gap-2">
                <Mail size={16} /> {seeker.email || "—"}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} /> {seeker.phone || "—"}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />{" "}
                {new Date(application.applied_at).toLocaleString()}
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} /> {seeker.address || "No location"}
              </div>
            </div>
          </div>
        </div>

        {/* Education + Skills + Language + Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {/* Education */}
          <div className="bg-graywhite p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-grayblack/80 mb-3 text-xl">
              Education
            </h4>
            {education.length > 0 ? (
              education.map((edu) => (
                <div
                  key={edu.id}
                  className="mb-3 text-sm text-grayblack/80 space-y-2"
                >
                  <p>
                    🎓 <strong>{edu.degree}</strong> — {edu.school_name}
                  </p>
                  <p>{edu.field_of_study && `Field: ${edu.field_of_study}`}</p>
                  <p>
                    Year: {edu.start_year} - {edu.end_year || "Present"}
                  </p>
                  <p>{edu.description}</p>
                  <p className="text-xs text-grayblack/75">
                    Location: {edu.location || "—"} | GPA: {edu.gpa || "N/A"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-grayblack/70 text-sm">
                No education data found
              </p>
            )}
          </div>

          {/* Skills */}
          <div className="bg-graywhite p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-grayblack/80 mb-3 text-xl">
              Skills
            </h4>
            {skills.length > 0 ? (
              skills.map((skill) => {
                const levelMap = {
                  1: "Beginner",
                  2: "Intermediate",
                  3: "Advanced",
                  4: "Expert",
                };
                const percentMap = {
                  1: "25%",
                  2: "50%",
                  3: "75%",
                  4: "100%",
                };
                return (
                  <div key={skill.id} className="mb-3">
                    <p className="text-sm text-grayblack/75 mb-2">
                      {skill.name} ({levelMap[skill.proficiency_level]})
                    </p>
                    <div className="w-full bg-transparent border border-darkblue rounded-full h-4">
                      <div
                        className="bg-darkblue h-4 rounded-full w-full"
                        style={{ width: percentMap[skill.proficiency_level] }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-grayblack/70 text-sm">No skill data found</p>
            )}
          </div>

          {/* Experience */}
          <div className="bg-graywhite p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-grayblack/80 mb-3 text-xl">
              Experience
            </h4>
            {experience.length > 0 ? (
              experience.map((exp) => (
                <div
                  key={exp.id}
                  className="mb-3 text-sm text-grayblack/75 space-y-2"
                >
                  <p className="font-medium text-grayblack/80">
                    {exp.job_title || exp.position}
                  </p>
                  <p>{exp.company_name}</p>
                  <p className="text-xs text-grayblack/75">
                    {exp.start_date} - {exp.end_date || "Present"}
                  </p>
                  <p className="mt-1">{exp.description}</p>
                  <p className="text-xs text-grayblack/70">
                    Location: {exp.location || "—"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-grayblack/70 text-sm">No experience found</p>
            )}
          </div>

          {/* Languages */}
          <div className="bg-graywhite p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-grayblack/80 mb-3 text-xl">
              Languages
            </h4>
            {languages.length > 0 ? (
              languages.map((lang) => (
                <p key={lang.id} className="text-sm text-grayblack/75">
                  {lang.name} — {lang.proficiency}
                </p>
              ))
            ) : (
              <p className="text-grayblack/70 text-sm">No languages found</p>
            )}
          </div>

          {/* Resume */}
          <div className="bg-graywhite p-4 rounded-xl shadow-sm">
            <h4 className="font-semibold text-grayblack/80 mb-3 text-xl">
              Resume
            </h4>
            {application.resume ? (
              <div className="space-y-0.5">
                <p className="text-md">{application.resume.title}</p>
                <a
                  className="text-darkblue hover:text-darkblue-hover hover:underline"
                  href={API_URL + application.resume.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View File
                </a>
              </div>
            ) : (
              <p className="text-grayblack/70 text-sm">No resume uploaded</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
