const API_URL = import.meta.env.VITE_API_URL;
const VITE_NOTIFICATIONS_BASE_URL = "/notifications/notifications/applications/";

export const NOTIFICATION_ENDPOINTS = {
  LIST: `${API_URL}${VITE_NOTIFICATIONS_BASE_URL}`,
  MARK_READ: (id) =>
    `${API_URL}${VITE_NOTIFICATIONS_BASE_URL}${id}/mark-read/`,
  MARK_UNREAD: (id) =>
    `${API_URL}${VITE_NOTIFICATIONS_BASE_URL}${id}/mark-unread/`,
  DELETE_ONE: (id) =>
    `${API_URL}${VITE_NOTIFICATIONS_BASE_URL}delete/${id}/`,
<<<<<<< HEAD
  DELETE_ALL:`${API_URL}${VITE_NOTIFICATIONS_BASE_URL}all-delete/`,
};
=======
  DELETE_ALL: `${API_URL}${VITE_NOTIFICATIONS_BASE_URL}all-delete/`,
};
>>>>>>> 7eda1bc2e1e22033cb11ca6a7f921b7dbc70885a
