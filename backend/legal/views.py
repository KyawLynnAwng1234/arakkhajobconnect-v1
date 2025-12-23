from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import *
from .serializers import *
from Notification.models import Notification
from legal.utils import notify_admin_contact
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
User=get_user_model()

@api_view(['GET'])
def privacy_policy(request):
    # Get all privacy policies, latest first
    policies = PrivacyPolicy.objects.all()
    serializer = PrivacyPolicySerializer(policies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def about_us(request):
    try:
        about = AboutUs.objects.latest('updated_at')
    except AboutUs.DoesNotExist:
        return Response({"detail": "About Us information not found."}, status=status.HTTP_404_NOT_FOUND)   
    serializer = AboutUsSerializer(about)
    return Response(serializer.data)

@api_view(["POST"])
def contact_us(request):
    serializer = ContactMessageSerializer(data=request.data)
    if serializer.is_valid():
        contact = serializer.save()
        # Notify admin about new contact message
        notify_admin_contact(contact)
        return Response(
            {"success": "Your message has been sent successfully"},
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

