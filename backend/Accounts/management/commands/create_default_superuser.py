from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
import os

User = get_user_model()

class Command(BaseCommand):
    help = "Create default superuser if not exists"

    def handle(self, *args, **options):
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        if not email or not password:
            self.stdout.write("Superuser env vars not set. Skipping.")
            return

        if User.objects.filter(email=email).exists():
            self.stdout.write("Superuser already exists. Skipping.")
            return

        User.objects.create_superuser(
            email=email,
            password=password,
            role="employer",  # or admin if you have one
            is_verified=True,
        )

        self.stdout.write("Superuser created successfully.")
