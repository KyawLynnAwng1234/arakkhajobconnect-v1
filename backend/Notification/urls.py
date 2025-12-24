from django.urls import path
from . import views
from .import admin_views

urlpatterns = [
    # ===== Application (frontend) notifications =====
    path('notifications/applications/', views.application_notification_list, name='notification-list'),
    path('notifications/applications/<uuid:pk>/mark-read/', views.application_notification_mark_read),
    path('notifications/applications/mark-all-read/', views.application_notification_mark_all_read),
    path('notifications/applications/<uuid:pk>/mark-unread/', views.application_notification_mark_unread),
    path('notifications/applications/all-delete/', views.application_notification_delete_all),
    path('notifications/applications/delete/<uuid:pk>/', views.application_notification_delete),

    # ===== Job notifications (frontend / employer) =====
    path('notifications/jobs/', views.job_notifications_list, name='job-notification-list'),

    # ===== ADMIN notifications =====
    path('admin/notifications/', admin_views.admin_notifications_page, name='admin-notifications'),
    path('admin/notifications-count/', admin_views.admin_notifications_count, name='admin-notifications-count'),
    path('admin/notifications/<uuid:pk>/mark-read/', admin_views.admin_notifications_mark_read, name='admin-notification-mark-read'),
    path('admin/notifications/mark-all-read/', admin_views.admin_notifications_mark_all, name='admin-notifications-mark-all'),
]
