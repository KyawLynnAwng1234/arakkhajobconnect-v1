from django.core.mail import send_mail
from django.conf import settings
from Accounts.utils.device_tokens import generate_device_verification_token


def send_device_verification_email(user, device):
    token = generate_device_verification_token(device)

    verify_url = f"{settings.FRONTEND_URL}/verify-device?token={token}"

    subject = "Verify new device login"

    message = f"""
Hello {user.email},

We detected a login from a new device.

Device: {device.device_name}
OS: {device.os}
Browser: {device.browser}

To continue, please verify this device by clicking the link below:

{verify_url}

This link will expire in 15 minutes.

If this was not you, please reset your password immediately.

— Arakkha Job Connect Security Team
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )
