# common/views.py
from django.shortcuts import render,redirect
from django.http import HttpResponse, Http404
from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth import login
from Accounts.models import LoginDevice
from Accounts.utils.device_tokens import verify_device_verification_token
from rest_framework import status
from django.contrib.auth import update_session_auth_hash
from Accounts.utils.device import get_client_ip, parse_user_agent, generate_fingerprint
import hashlib
User = get_user_model()

def avatar_svg(request, user_id):
    try:
        u = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        raise Http404()
    name = (getattr(u, "full_name", "") or f"{getattr(u,'first_name','')} {getattr(u,'last_name','')}".strip() or getattr(u, "email", "").split("@")[0] or "User").strip()
    initials = (name[0] if name else "U").upper()
    key = (getattr(u, "email", "") or str(u.pk)).lower()
    palette = ["#817639","#F43F5E","#10B981","#F59E0B","#758398","#8B5CF6","#EF4444","#22C55E","#14B8A6","#A855F7"]
    color = palette[int(hashlib.md5(key.encode()).hexdigest(), 16) % len(palette)]
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <rect width="256" height="256" rx="32" fill=""/>
    <text x="50%" y="50%" dy=".1em" text-anchor="middle" font-family="-apple-system,Segoe UI,Roboto,Arial" font-size="110" font-weight="700" fill="#fff">{initials}</text>
    </svg>'''
    r = HttpResponse(svg, content_type="image/svg+xml; charset=utf-8")
    r["Cache-Control"] = "public, max-age=86400"
    return r


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):   
    user=request.user    
    user.save()
    update_session_auth_hash(request, user)
    return Response({"success": "Password updated successfully."}, status=200)



@api_view(["GET"])
@permission_classes([AllowAny])
def verify_device(request):
    token = request.GET.get("token")

    fingerprint = verify_device_verification_token(token)
    if not fingerprint:
        return render(
            request,
            "security/verify_device_invalid.html",
            status=400
        )

    device = LoginDevice.objects.filter(fingerprint=fingerprint).select_related("user").first()
    if not device:
        return render(
            request,
            "security/verify_device_invalid.html",
            status=404
        )

    # ✅ Mark device verified
    device.is_verified = True
    device.verified_at = timezone.now()
    device.save(update_fields=["is_verified", "verified_at"])

    # ✅ LOG USER IN (CRITICAL)
    login(request, device.user)

    # ✅ Redirect to dashboard
    return redirect("/accounts-employer/employer/dashboard/")

