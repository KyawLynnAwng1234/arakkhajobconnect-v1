import React from "react";
import { Route } from "react-router-dom";

import EmployerDashboardLayout from "../pages/employer/dashboard/EmployerDashboard";
import Overview from "../pages/employer/dashboard/OverView";

import MyJobs from "../pages/employer/jobs-page/MyJobs";
import EditJob from "../pages/employer/jobs-page/EditJob";
import PostJob from "../pages/employer/jobs-page/PostJob";
import JobDetail from "../components/employer/jobs/JobDetail";

import JobCategoryListPage from "../pages/employer/job-categories-page/JobCategoryListPage";

import NotificationLists from "../pages/employer/dashboard/NotificationLists";

import EmployerProfile from "../pages/employer/profile/EmployerProfile";
import EmployerProfileEditPage from "../pages/employer/profile/EmployerProfileEditPage";

import JobApplication from "../pages/employer/job-application/JobApplication";
import JobApplicationProfileDetail from "../pages/employer/job-application/JobApplicationProfileDetail";

export const EmployerRoutes = (
  <Route path="/employer/dashboard" element={<EmployerDashboardLayout />}>
    <Route index element={<Overview />} />

    {/* job */}
    <Route path="my-jobs">
      <Route index element={<MyJobs />} />
      <Route path="job-create" element={<PostJob />} />
      <Route path=":id/edit" element={<EditJob />} />
      <Route path=":id/detail" element={<JobDetail />} />
    </Route>

    {/* job-category */}
      <Route path="job-category" element={<JobCategoryListPage />} />

    <Route path="notification-list" element={<NotificationLists />} />

    {/* Profile */}
    <Route path="profile">
      <Route index element={<EmployerProfile />} />
      <Route path="edit" element={<EmployerProfileEditPage />} />
    </Route>

    {/* Application */}
    <Route path="applications">
      <Route index element={<JobApplication />} />
      <Route path=":id" element={<JobApplicationProfileDetail />} />
    </Route>
  </Route>
);
