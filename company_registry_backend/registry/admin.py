# registry/admin.py
from django.contrib import admin
from .models import CompanyRegistry

@admin.register(CompanyRegistry)
class CompanyRegistryAdmin(admin.ModelAdmin):
    list_display = ("company_name", "license_number", "status", "created_at")
    search_fields = ("company_name", "license_number")
    list_filter = ("status",)

