from django.core.mail import EmailMultiAlternatives
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from django.template.loader import render_to_string
from django.conf import settings
import datetime
from .models import EmployerEmailVerification


def send_verification_email(request, user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)

    EmployerEmailVerification.objects.update_or_create(user=user)

    verify_url = request.build_absolute_uri(
        reverse("employer-emailverifypage",
                kwargs={"uidb64": uid, "token": token})
    )

    subject = "Verify Your Employer Account"

    text_content = (
        f"Hello {user.email},\n\n"
        f"Please verify your employer account using the link below:\n"
        f"{verify_url}\n\n"
        f"If you didn't request this, you can ignore this email."
    )

    html_content = render_to_string(
        "emails/employer_email_verify.html",
        {
            "email": user.email,
            "verify_url": verify_url,
            "year": datetime.datetime.now().year,
        },
    )

    try:
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[user.email],
        )
        msg.attach_alternative(html_content, "text/html")
        msg.send(fail_silently=False)
        return True

    except Exception as e:
        print("EMPLOYER EMAIL SEND ERROR:", e)
        return False

