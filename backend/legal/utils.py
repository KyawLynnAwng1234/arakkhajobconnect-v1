from django.contrib.contenttypes.models import ContentType
from Notification.models import Notification
from django.contrib.auth import get_user_model
from .models import ContactMessage
User = get_user_model()

def notify_admin_contact(contact):
    admin = User.objects.filter(is_superuser=True).first()
    if admin:
        ct_contact = ContentType.objects.get_for_model(ContactMessage)
        Notification.objects.create(
            user=admin,                        
            content_type=ct_contact,           
            object_id=contact.id,              
            message=f"{contact.full_name} sent a contact message",
            type="contact",               
            )

