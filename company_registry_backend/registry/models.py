from django.db import models

# Create your models here.

class CompanyRegistry(models.Model):
    company_name = models.CharField(max_length=255)
    license_number = models.CharField(max_length=100, unique=True)

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.company_name} ({self.license_number})"

