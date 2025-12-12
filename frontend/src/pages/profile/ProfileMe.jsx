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
      .catch(() => { });

    axios
      .get(`${API_URL}/accounts-jobseeker/experience/?profile=${profile.id}`)
      .then((res) => setExperienceList(res.data))
      .catch(() => { });

    axios
      .get(`${API_URL}/accounts-jobseeker/language/?profile=${profile.id}`)
      .then((res) => setLanguageList(res.data))
      .catch(() => { });

    axios
      .get(`${API_URL}/accounts-jobseeker/skill/?profile=${profile.id}`)
      .then((res) => setSkillList(res.data))
      .catch(() => { });
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
      <section className="relative bg-gradient-to-r from-[#002366] to-[#003AB3] text-white py-10 rounded-b-2xl shadow-lg">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8 items-center">
          {/* LEFT INFO */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">
              {profile.full_name || "Full Name"}
            </h1>
            <p className="text-white/70">
              {profile.bio || "Write something about yourself..."}
            </p>

            <div className="space-y-1 text-white/70">
              <div className="flex items-center gap-2">
                <FaLocationDot />
                <span>{profile.address || "Your Address"}</span>
              </div>

              <div className="flex items-center gap-2">
                <CiPhone />
                <span>{profile.phone || "Your Phone"}</span>
              </div>

              <div className="flex items-center gap-2">
                <CiMail />
                <span>{profile.email || "Your Email"}</span>
              </div>
            </div>
          </div>

          {/* SOCIAL LINKS */}
          <div className="space-y-1 text-white/70">
            <div className="flex items-center gap-2">
              <CiGlobe />
              <a href={profile.website || "#"}>
                {profile.website || "Website"}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <FaLinkedin />
              <a href={profile.linkedin || "#"}>
                {profile.linkedin || "LinkedIn"}
              </a>
            </div>

            <div className="flex items-center gap-2">
              <FaGithub />
              <a href={profile.github || "#"}>{profile.github || "GitHub"}</a>
            </div>
          </div>

          {/* PROFILE PICTURE */}
          <div className="flex justify-end">
            <Menu as="div">
              <Menu.Button>
                <img
                  src={
                    profile.profile_picture
                      ? `${API_URL}${profile.profile_picture}`
                      : "/default-avatar.png"
                  }
                  className="w-36 h-36 rounded-full border-4 border-white shadow-md cursor-pointer"
                />
              </Menu.Button>

              <Menu.Items className="absolute bg-white border shadow rounded mt-2 right-0">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        document.getElementById("uploadInput").click()
                      }
                      className={`w-full px-4 py-2 text-left ${active ? "bg-blue-50" : ""
                        }`}
                    >
                      Upload
                    </button>
                  )}
                </Menu.Item>

                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() =>
                        window.open(
                          profile.profile_picture
                            ? `${API_URL}${profile.profile_picture}`
                            : "/default-avatar.png",
                          "_blank"
                        )
                      }
                      className={`w-full px-4 py-2 text-left ${active ? "bg-blue-50" : ""
                        }`}
                    >
                      View
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>

              <input
                id="uploadInput"
                type="file"
                className="hidden"
                onChange={handleUpload}
              />
            </Menu>
          </div>
        </div>

        <button
          onClick={() => navigate("/profile/me/edit")}
          className="absolute top-8 right-8 bg-white text-blue-700 rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:bg-gray-100"
        >
          ✎
        </button>
      </section>

      {/* PROFILE MESSAGE */}
      {profileMessage.text && (
        <div
          className={`container mx-auto px-4 py-3 mt-4 rounded ${profileMessage.type === "success"
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
            editData ? prev.map((e) => (e.id === edu.id ? edu : e)) : [...prev, edu]
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
            editData ? prev.map((e) => (e.id === exp.id ? exp : e)) : [...prev, exp]
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
            editData ? prev.map((l) => (l.id === lang.id ? lang : l)) : [...prev, lang]
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
            editData ? prev.map((s) => (s.id === skill.id ? skill : s)) : [...prev, skill]
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
            editData ? prev.map((r) => (r.id === resume.id ? resume : r)) : [...prev, resume]
          );
          handleProfileUpdateMessage();
        }}
      />
    </div>
  );
}