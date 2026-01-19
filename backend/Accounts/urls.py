from django.urls import path
from .views import *

urlpatterns = [

    path("home/",home,name="homepage"),
    path("avatar/<uuid:user_id>.svg", avatar_svg, name="avatar-svg"),
    path("password-changed/",change_password,name="password-change-page"),
    path("verify-device/", verify_device, name="verify-device"),

    #OAuth
    path("auth/google/start/", google_login_start,name="google-login"),
    path("auth/google/callback/",google_login_callback,name="google-login-callback"),


]
