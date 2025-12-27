from django.apps import AppConfig

class ApplicationConfig(AppConfig):
    name = "Application"

    def ready(self):
        import Application.utils 
