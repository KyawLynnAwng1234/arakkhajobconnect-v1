import React, { useEffect, useState } from "react";
import axios from "axios";
import { CiMail, CiPhone, CiGlobe } from "react-icons/ci";
import { FaLocationDot, FaLinkedin, FaGithub } from "react-icons/fa6";
import { Menu } from "@headlessui/react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import EditSummaryModal from "./editprofile/EditSummaryModal";
import EducationModal from "./editprofile/EducationModal";
import ExperienceModal from "./editprofile/ExperienceModal";
import SkillModal from "./editprofile/SkillModal";
import LanguageModal from "./editprofile/LanguageModal";
import ResumeModal from "./editprofile/ResumeModal";

import EducationList from "./editprofile/ProfileListDetail/EducationList";
import ExperienceList from "./editprofile/ProfileListDetail/ExperienceList";
import LanguageList from "./editprofile/ProfileListDetail/LanguageList";
import SkillList from "./editprofile/ProfileListDetail/SkillList";
import ResumeList from "./editprofile/ProfileListDetail/ResumeList";
import usePageTitle from "../../hooks/usePageTitle";

// CSRF token helper
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

export default function ProfileMe() {
  usePageTitle("Profile");
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    full_name: "",
    address: "",
    phone: "",
    bio: "",
    profile_picture: "",
    website: "",
    linkedin: "",
    github: "",
    email: "",
  });

  const [educationList, setEducationList] = useState([]);
  const [experienceList, setExperienceList] = useState([]);
  const [languageList, setLanguageList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [resumeList, setResumeList] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [isEducationOpen, setIsEducationOpen] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const [profileMessage, setProfileMessage] = useState({ type: "", text: "" });

  const API_URL = import.meta.env.VITE_API_URL;

  // -----------------------
  // Load Profile
  // -----------------------
  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/sign-in", { replace: true });
      return;
    }

    axios
      .get(`${API_URL}/accounts-jobseeker/jobseekerprofile/`, {
        withCredentials: true,
      })
      .then((res) => {
        const profileData = Array.isArray(res.data) ? res.data[0] : {};
        setProfile({
          ...profileData,
          email: user.email || "",
        });
      })
      .catch((err) => console.error("Error loading profile:", err));
  }, [user, loading, navigate]);

  // -----------------------
  // Load Sub-Items (Edu, Exp, etc.)
  // -----------------------
  useEffect(() => {
    if (!profile.id) return;

    axios
      .get(`${API_URL}/accounts-jobseeker/education/?profile=${profile.id}`)
      .then((res) => setEducationList(res.data))
      .catch(() => {});

    axios
      .get(`${API_URL}/accounts-jobseeker/experience/?profile=${profile.id}`)
      .then((res) => setExperienceList(res.data))
      .catch(() => {});

    axios
      .get(`${API_URL}/accounts-jobseeker/language/?profile=${profile.id}`)
      .then((res) => setLanguageList(res.data))
      .catch(() => {});

    axios
      .get(`${API_URL}/accounts-jobseeker/skill/?profile=${profile.id}`)
      .then((res) => setSkillList(res.data))
      .catch(() => {});
  }, [profile]);

  // -----------------------
  // Upload Profile Photo
  // -----------------------
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_picture", file);

    try {
      const csrfToken = getCookie("csrftoken");
      const res = await axios.put(
        `${API_URL}/accounts-jobseeker/jobseekerprofile/${profile.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-CSRFToken": csrfToken,
          },
          withCredentials: true,
        }
      );

      setProfile((prev) => ({
        ...prev,
        profile_picture: res.data.profile_picture,
      }));
    } catch (err) {
      console.error("Picture upload error:", err);
    }
  };

  // -----------------------
  // COMPLETENESS LOGIC — UPDATED
  // -----------------------
  const checkProfileCompleteness = () => {
    const required = [];
    const recommended = [];

    // REQUIRED FIELDS
    if (!profile.full_name) required.push("Full Name");
    if (!profile.phone) required.push("Phone");
    if (!profile.bio) required.push("Summary (Bio)");

    // Resume MUST exist
    if (resumeList.length === 0) required.push("Resume");

    // OPTIONAL FIELDS
    if (!profile.address) recommended.push("Address");
    if (!profile.profile_picture) recommended.push("Profile Picture");

    if (educationList.length === 0) recommended.push("Education");
    if (experienceList.length === 0) recommended.push("Experience");
    if (languageList.length === 0) recommended.push("Language");
    if (skillList.length === 0) recommended.push("Skill");

    return { required, recommended };
  };

  const handleProfileUpdateMessage = () => {
    const { required, recommended } = checkProfileCompleteness();

    if (required.length > 0) {
      setProfileMessage({
        type: "error",
        text: `⚠️ Please complete required fields: ${required.join(", ")}`,
      });
    } else if (recommended.length > 0) {
      setProfileMessage({
        type: "warning",
        text: `💡 Improve your profile by adding: ${recommended.join(", ")}`,
      });
    } else {
      setProfileMessage({
        type: "success",
        text: "🎉 Your profile is fully complete!",
      });
    }
  };

  useEffect(() => {
    if (profile.id) handleProfileUpdateMessage();
  }, [
    profile,
    educationList,
    experienceList,
    languageList,
    skillList,
    resumeList,
  ]);

  // -----------------------
  // UI Rendering
  // -----------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO SECTION */}
      <section className="relative flex bg-darkblue min-h-[530px] text-white py-8 md:py-12 rounded-b-3xl shadow-xl overflow-hidden">
        <div className="relative container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
          {/* Left Column — Name + Bio + Contacts */}
          <div className="space-y-4 md:space-y-5 order-2 md:order-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg">
              {profile.full_name || "Full Name"}
            </h1>

            <p className="text-white/90 leading-relaxed text-base sm:text-lg max-w-md mx-auto md:mx-0">
              {profile.bio || "Write something about yourself..."}
            </p>

            {/* Contact Info */}
            <div className="space-y-2 text-white/90 text-sm sm:text-base">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <FaLocationDot />
                <span>{profile.address || "Your Address"}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <CiPhone />
                <span>{profile.phone || "Your Phone"}</span>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-3">
                <CiMail />
                <span>{profile.email || "Your Email"}</span>
              </div>
            </div>

            {/* Social Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3 pt-2">
              <a
                href={profile.website || "#"}
                target="_blank"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm hover:bg-white/30 transition flex items-center gap-1"
              >
<<<<<<< HEAD
                🌐{profile.website || "Website"}
=======
                <CiGlobe /> {profile.website || "Website"}
>>>>>>> cdf9736b49efe02e695c6c540ec6bc35df4f7028
              </a>

              <a
                href={profile.linkedin || "#"}
                target="_blank"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm hover:bg-white/30 transition flex items-center gap-1"
              >
<<<<<<< HEAD
                💼 {profile.linkedin || "Linkedin"}
=======
                <FaLinkedin /> {profile.linkedin || "LinkedIn"}
>>>>>>> cdf9736b49efe02e695c6c540ec6bc35df4f7028
              </a>

              <a
                href={profile.github || "#"}
                target="_blank"
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm hover:bg-white/30 transition flex items-center gap-1"
              >
<<<<<<< HEAD
                🐙 {profile.github || "GitHub"}
=======
                <FaGithub /> {profile.github || "GitHub"}
>>>>>>> cdf9736b49efe02e695c6c540ec6bc35df4f7028
              </a>
            </div>
          </div>

          {/* Profile Picture Section */}
          <div className="flex justify-center md:justify-end relative order-1 md:order-2 mb-4 md:mb-0">
            <Menu as="div" className="relative inline-block">
              {({ open }) => (
                <>
                  <Menu.Button className="focus:outline-none">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-full bg-white opacity-20 blur-2xl"></div>

                      <img
                        src={
                          profile.profile_picture
                            ? `${import.meta.env.VITE_API_URL}${
                                profile.profile_picture
                              }`
                            : "/default-avatar.png"
                        }
                        alt="Profile"
                        className={`relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full object-cover border-4 border-white shadow-2xl transition ${
                          open ? "ring-4 ring-white/50" : ""
                        }`}
                      />
                    </div>
                  </Menu.Button>

                  <Menu.Items className="absolute left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 mt-3 w-40 bg-white rounded-xl shadow-xl z-20">
                    <div className="py-2">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              document.getElementById("uploadInput").click()
                            }
                            className={`${
                              active ? "bg-gray-100" : ""
                            } w-full text-left px-4 py-2 text-gray-700 text-sm`}
                          >
                            Upload Photo
                          </button>
                        )}
                      </Menu.Item>

                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() =>
                              window.open(
                                profile.profile_picture
                                  ? `${import.meta.env.VITE_API_URL}${
                                      profile.profile_picture
                                    }`
                                  : "/default-avatar.png",
                                "_blank"
                              )
                            }
                            className={`${
                              active ? "bg-gray-100" : ""
                            } w-full text-left px-4 py-2 text-gray-700 text-sm`}
                          >
                            View Photo
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </>
              )}
            </Menu>

            <input
              type="file"
              id="uploadInput"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleUpload(e)}
            />
          </div>
        </div>

        {/* Floating Edit Button */}
        <button
          onClick={() => navigate("/profile/me/edit")}
          className="absolute top-4 right-4 md:top-10 md:right-10 bg-white text-blue-700 rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:bg-gray-200 transition"
        >
          ✎
        </button>
      </section>

      {/* PROFILE MESSAGE */}
      {profileMessage.text && (
        <div
          className={`container mx-auto px-4 py-3 mt-4 rounded ${
            profileMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : profileMessage.type === "warning"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {profileMessage.text}
        </div>
      )}

      {/* MAIN CONTENT */}
      <section className="container mx-auto px-4 py-10 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Summary */}
          <div>
            <label className="font-semibold">Summary (Job Purpose)</label>
            <div className="relative" onClick={() => setIsModalOpen(true)}>
              <input
                type="text"
                value={profile.bio || ""}
                readOnly
                className="w-full border rounded px-4 py-2 cursor-pointer"
                placeholder="Write your job purpose..."
              />
              <span className="absolute right-3 top-2 text-gray-500">✎</span>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Education</h2>
              <button
                className="text-blue-600"
                onClick={() => {
                  setEditData(null);
                  setIsEducationOpen(true);
                }}
              >
                + Add
              </button>
            </div>
            <EducationList
              profileId={profile.id}
              educationList={educationList}
              setEducationList={setEducationList}
              onEdit={(edu) => {
                setEditData(edu);
                setIsEducationOpen(true);
              }}
            />
          </div>

          {/* Experience */}
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Experience</h2>
              <button
                className="text-blue-600"
                onClick={() => {
                  setEditData(null);
                  setIsExperienceModalOpen(true);
                }}
              >
                + Add
              </button>
            </div>
            <ExperienceList
              profileId={profile.id}
              experienceList={experienceList}
              setExperienceList={setExperienceList}
              onEdit={(exp) => {
                setEditData(exp);
                setIsExperienceModalOpen(true);
              }}
            />
          </div>

          {/* Language */}
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Languages</h2>
              <button
                className="text-blue-600"
                onClick={() => {
                  setEditData(null);
                  setIsLanguageModalOpen(true);
                }}
              >
                + Add
              </button>
            </div>
            <LanguageList
              profileId={profile.id}
              languageList={languageList}
              setLanguageList={setLanguageList}
              onEdit={(lang) => {
                setEditData(lang);
                setIsLanguageModalOpen(true);
              }}
            />
          </div>

          {/* Skill */}
          <div className="bg-white p-4 rounded shadow-sm">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold">Skills</h2>
              <button
                className="text-blue-600"
                onClick={() => {
                  setEditData(null);
                  setIsSkillModalOpen(true);
                }}
              >
                + Add
              </button>
            </div>
            <SkillList
              profileId={profile.id}
              skillList={skillList}
              setSkillList={setSkillList}
              onEdit={(skill) => {
                setEditData(skill);
                setIsSkillModalOpen(true);
              }}
            />
          </div>
        </div>

        {/* Resume */}
        <div className="w-full lg:w-1/3 bg-blue-50 p-6 rounded shadow-inner">
          <div className="flex justify-between mb-3">
            <h2 className="font-semibold text-blue-900">Resume</h2>
            <button
              className="border px-4 py-1 rounded text-blue-600 border-blue-400"
              onClick={() => {
                setEditData(null);
                setIsResumeModalOpen(true);
              }}
            >
              + Add
            </button>
          </div>

          <ResumeList
            profileId={profile.id}
            resumeList={resumeList}
            setResumeList={setResumeList}
            onEdit={(resume) => {
              setEditData(resume);
              setIsResumeModalOpen(true);
            }}
          />
        </div>
      </section>

      {/* MODALS */}
      <EditSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EducationModal
        isOpen={isEducationOpen}
        onClose={() => setIsEducationOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
        editData={editData}
        onSuccess={(edu) => {
          setEducationList((prev) =>
            editData
              ? prev.map((e) => (e.id === edu.id ? edu : e))
              : [...prev, edu]
          );
          handleProfileUpdateMessage();
        }}
      />

      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
        editData={editData}
        onSuccess={(exp) => {
          setExperienceList((prev) =>
            editData
              ? prev.map((e) => (e.id === exp.id ? exp : e))
              : [...prev, exp]
          );
          handleProfileUpdateMessage();
        }}
      />

      <LanguageModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
        editData={editData}
        onSuccess={(lang) => {
          setLanguageList((prev) =>
            editData
              ? prev.map((l) => (l.id === lang.id ? lang : l))
              : [...prev, lang]
          );
          handleProfileUpdateMessage();
        }}
      />

      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
        editData={editData}
        onSuccess={(skill) => {
          setSkillList((prev) =>
            editData
              ? prev.map((s) => (s.id === skill.id ? skill : s))
              : [...prev, skill]
          );
          handleProfileUpdateMessage();
        }}
      />

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        profileId={profile.id}
        profileName={profile.full_name}
        editData={editData}
        onSuccess={(resume) => {
          setResumeList((prev) =>
            editData
              ? prev.map((r) => (r.id === resume.id ? resume : r))
              : [...prev, resume]
          );
          handleProfileUpdateMessage();
        }}
      />
    </div>
  );
}
