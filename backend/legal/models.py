from django.db import models
from ckeditor.fields import RichTextField

class PrivacyPolicy(models.Model):
    title = models.CharField(max_length=255, default="Privacy Policy")
    content = RichTextField()
    contact_email = models.EmailField(default="support@jobseeker.com",null=True)
    contact_address = models.TextField(default="JobSeeker Inc., 123 Career Street, City, Country",null=True)
    created_at=models.DateField(auto_now_add=True,null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class AboutUs(models.Model):
    title = models.CharField(max_length=255, default="About Us")
    content = RichTextField()
    mission_statement = RichTextField(default="To connect job seekers with their dream jobs.")
    vision_statement = RichTextField(default="To be the leading platform for job seekers worldwide.")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title



class ContactMessage(models.Model):
    SUBJECT_CHOICES = [
        ("general", "General Inquiry"),
        ("job", "Job Related"),
        ("employer", "Employer Support"),
        ("technical", "Technical Issue"),
        ("other", "Other"),
    ]

    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    message = models.TextField()
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.full_name} - {self.subject}"

