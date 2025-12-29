import { useState } from "react";
import { useNotificationAuth } from "../../../hooks/useNotificationAuth";
import { toast } from "react-hot-toast";

export default function NotificationLists() {
  const { notifications, loading, markRead, markUnread, deleteOne, deleteAll } =
    useNotificationAuth();

  // tab state: all | unread | read
  const [activeTab, setActiveTab] = useState("all");


  // filter notifications based on tab
  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.is_read;
    if (activeTab === "read") return notif.is_read;
    return true;
  });

  // toggle read / unread on card click
  const handleToggleRead = (notif) => {
    if (notif.is_read) {
      markUnread(notif.id);
    } else {
      markRead(notif.id);
    }
  };

  const handleDelete = (notif) => {
    if (!notif.is_read) {
      toast.error("Mark the notification.");
      return;
    }

    deleteOne(notif.id);
  };

  return (
    <div>
      {/* ================= Header ================= */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-darkblue">Notifications</h1>

        <button
          onClick={deleteAll}
          className="text-red-600 font-semibold hover:underline cursor-pointer"
        >
          Clear Notifications
        </button>
      </div>

      {/* ================= Tabs ================= */}
      <div className="flex gap-4 mb-6 border-b">
        {[
          { key: "all", label: "All Notifications" },
          { key: "unread", label: "Unread Notifications" },
          { key: "read", label: "Read Notifications" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`pb-2 font-semibold transition cursor-pointer
              ${
                activeTab === tab.key
                  ? "border-b-2 border-darkblue text-darkblue"
                  : "text-gray-500 hover:text-darkblue"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= Content ================= */}
      {loading && <p>Loading...</p>}

      {!loading && filteredNotifications.length === 0 && (
        <p className="text-gray-500">No notifications found.</p>
      )}

      <div className="space-y-2">
        {filteredNotifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => handleToggleRead(notif)}
            className={`flex justify-between items-center p-4 border rounded-lg cursor-pointer transition
              ${
                notif.is_read
                  ? "border-darkblue/6 hover:border-darkblue-hover/6 bg-darkblue/3 hover:bg-darkblue-hover/3"
                  : "bg-yellowbutton/15 border-yellowbutton/20 hover:bg-hoveryellowbutton/20"
              }`}
          >
            {/* Text */}
            <div>
              <p className="font-medium text-grayblack">{notif.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(notif.created_at).toLocaleString()}
              </span>
            </div>

            {/* Actions */}
            <div
              className="flex gap-3 text-sm"
              onClick={(e) => e.stopPropagation()} // prevent card toggle
            >
              {/* Status Label */}
              <span
                className={`px-2 py-0.5 rounded text-xs font-semibold
                  ${
                    notif.is_read
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
              >
                {notif.is_read ? "Mark" : "Unmark"}
              </span>

              {/* Delete */}
              <button
                onClick={() => handleDelete(notif)}
                className="text-red-600 font-medium hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
