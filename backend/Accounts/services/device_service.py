from Accounts.models import LoginDevice
from Accounts.utils.device import get_client_ip, parse_user_agent, generate_fingerprint


def record_login_device(request, user):
    ip = get_client_ip(request)
    info = parse_user_agent(request)

    fingerprint = generate_fingerprint(info["raw"], ip)

    device, created = LoginDevice.objects.get_or_create(
        user=user,
        fingerprint=fingerprint,
        defaults={
            "device_name": info["device"],
            "os": info["os"],
            "browser": info["browser"],
            "user_agent": info["raw"],
            "ip_address": ip,
        },
    )
    if created:
        device.is_verified = False
        device.save(update_fields=["is_verified"])


    if not created:
        device.device_name = info["device"]
        device.os = info["os"]
        device.browser = info["browser"]
        device.user_agent = info["raw"]
        device.ip_address = ip
        device.save(update_fields=["device_name", "os", "browser", "user_agent", "ip_address", "last_login"])

    return device, created, info
