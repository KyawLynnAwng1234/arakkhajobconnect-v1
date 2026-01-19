import os
from pathlib import Path
from decouple import config


AUTH_USER_MODEL = 'Accounts.CustomUser'

#tell dj-rest-auth / django-allauth that remove user from custom model
ACCOUNT_USER_MODEL_USERNAME_FIELD = None    
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_USERNAME_REQUIRED = False
ACCOUNT_AUTHENTICATION_METHOD = 'email'



# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
ENVIRONMENT = config("ENVIRONMENT", default="local")

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', True)

ALLOWED_HOSTS = ['*', '.railway.app','192.168.130.155']

CORS_ALLOWED_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://192.168.130.155:5173",   # your phone/laptop React
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://192.168.130.155:5173",
    "http://192.168.130.155:8000",
]


MAILERSEND_API_TOKEN = config("MAILERSEND_API_TOKEN")
MAILERSEND_FROM_EMAIL = config("MAILERSEND_FROM_EMAIL")  # no-reply@arakkha.tech
MAILERSEND_FROM_NAME = config("MAILERSEND_FROM_NAME")

EMAIL_BACKEND = "anymail.backends.mailersend.EmailBackend"

DEFAULT_FROM_EMAIL = f"{MAILERSEND_FROM_NAME} <{MAILERSEND_FROM_EMAIL}>"

ANYMAIL = {
    "MAILERSEND_API_TOKEN": MAILERSEND_API_TOKEN,
}

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "Application.apps.ApplicationConfig",
    "Jobs.apps.JobsConfig",
    'Accounts.apps.AccountsConfig',
    "anymail",    

    #custome apps

    'EmployerProfile',
    'JobSeekerProfile',
    'Notification',
    'UI',
    'legal',
    
    # Allauth
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "allauth.socialaccount.providers.google",

    #third party apps
    'rest_framework',
    'corsheaders',
    'rest_framework.authtoken',
    "django_extensions", 
    'ckeditor',
]



MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',

    # Custom Middleware
    'JobSeeker.middleware.RateLimitMiddleware',
]



ROOT_URLCONF = 'JobSeeker.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR,'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

TEMPLATES[0]["OPTIONS"]["context_processors"] += [
    "django.template.context_processors.request",
]

WSGI_APPLICATION = 'JobSeeker.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases



# Use SQLite locally if DATABASE_URL is not set
if ENVIRONMENT == "local":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

else:  # production (Render + Aiven)
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.mysql",  # or postgresql
            "NAME": config("DB_NAME"),
            "USER": config("DB_USER"),
            "PASSWORD": config("DB_PASSWORD"),
            "HOST": config("DB_HOST"),
            "PORT": config("DB_PORT", cast=int),
            "OPTIONS": {
                "ssl": {"ca": config("DB_SSL_CA", default=None)}
            },
        }
    }


# Optional but recommended:
TIME_ZONE = "Asia/Yangon"
USE_TZ = True





# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / "JobSeeker" / "static"]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'




#contine with google
SOCIALACCOUNT_PROVIDERS = {
        'google': {
            'APP': {
                'client_id': os.getenv('GOOGLE_CLIENT_ID'),
                'secret':   os.getenv('GOOGLE_SECRET'),
                'key': ''  # Usually not required for OAuth2 providers
            },
            'SCOPE': [
                'profile',
                'email',
            ],
            'AUTH_PARAMS': {
                'access_type': 'online',
                'prompt': 'select_account'
            }
        }
    }


REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        # If you also use JWT, add:
        # "rest_framework_simplejwt.authentication.JWTAuthentication",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "otp": "5/minute",
    },
}

TOKEN_MODEL = None


CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.130.155:5173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "https://*.railway.app",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://192.168.130.155:5173",
    "https://*.railway.app",
]
CORS_ALLOW_CREDENTIALS = True

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
BACKEND_URL = "http://127.0.0.1:8000"






#Meaida files
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
