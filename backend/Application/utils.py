from django.db import transaction
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import Jobs
from Application.models import Application
from Notification.models import Notification



#Application created -> notify employer
@receiver(post_save, sender=Application)
def notify_on_application_created(sender, instance, created, **kwargs):
    if not created:
        return
    employer_user = instance.job.employer.user
    transaction.on_commit(lambda: Notification.objects.create(
        user=employer_user,
        message=f"New application submitted for '{getattr(instance.job, 'title', instance.job_id)}'.",
        type="application_created",
        content_type=ContentType.objects.get_for_model(Application),
        object_id=instance.id,
    ))
