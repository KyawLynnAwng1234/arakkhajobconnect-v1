from django.core.mail import send_mail
from django.conf import settings
from django.utils.html import strip_tags


def send_new_device_email(user, device, ip=None):
    """
    Send alert email when a new login device is detected
    """
    subject = "New login detected on your account"
    #HTML VERSION
    html_message = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New login detected</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f6f7f9; padding: 30px;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background-color: #ffffff; padding: 30px; border-radius: 8px;">

          <tr>
            <td style="text-align: center;">
              <h2 style="margin-bottom: 10px; color: #111;">
                New login detected
              </h2>
              <p style="color: #555; margin-top: 0;">
                We noticed a login from a new device on your employer account.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding: 20px 0;">
              <table width="100%" cellpadding="6" cellspacing="0"
                     style="background-color: #f9fafb; border-radius: 6px;">
                <tr>
                  <td><strong>Device</strong></td>
                  <td>{device.device_name}</td>
                </tr>
                <tr>
                  <td><strong>Operating System</strong></td>
                  <td>{device.os}</td>
                </tr>
                <tr>
                  <td><strong>Browser</strong></td>
                  <td>{device.browser}</td>
                </tr>
                <tr>
                  <td><strong>IP Address</strong></td>
                  <td>{ip or "Unknown"}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <p style="color: #333;">
                If this was you, no action is required.
              </p>

              <p style="color: #333;">
                If this wasn’t you, we recommend that you
                <strong>reset your password</strong> and review your active devices.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding-top: 20px; border-top: 1px solid #eee; color: #777;">
              <p style="font-size: 13px;">
                — Arakkha Job Connect Security Team
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""
    text_message = strip_tags(html_message)

    send_mail(
        subject=subject,
        message=text_message,          # plain text
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[user.email],
        html_message=html_message,     # HTML version
        fail_silently=False,
    )
