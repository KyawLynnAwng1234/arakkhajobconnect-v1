from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import transaction
from django.contrib.contenttypes.models import ContentType
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

from .models import Jobs
from Notification.models import Notification
from JobSeekerProfile.models import JobseekerProfile


@receiver(post_save, sender=Jobs)
def notify_on_job_created(sender, instance, created, **kwargs):
    if not created:
        return

    #Admin/Employer in-app notification
    if instance.employer and instance.employer.user:
        transaction.on_commit(lambda: Notification.objects.create(
            user=instance.employer.user,
            message=f"Job '{instance.title}' was created.",
            type="job",
            content_type=ContentType.objects.get_for_model(Jobs),
            object_id=instance.id,
        ))

    #Jobseeker notifications (exact category match)
    jobseekers = [
        js for js in JobseekerProfile.objects.all()
        if instance.category.id in js.applied_categories
    ]

    for js in jobseekers:
        context = {
            "full_name": js.full_name,
            "job_title": instance.title,
            "category_name": instance.category.name,
            "job_url": f"https://job.arakkha.tech/jobs/{instance.id}/",
            "year": 2025,
        }

        html_content = render_to_string(
            "emails/new_job_notification.html",
            context
        )
        text_content = strip_tags(html_content)

        email = EmailMultiAlternatives(
            subject="New job you may be interested in",
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[js.user.email],
        )
        email.attach_alternative(html_content, "text/html")
        email.send()
