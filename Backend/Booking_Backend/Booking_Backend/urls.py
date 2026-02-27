from django.contrib import admin
from django.urls import path, include

# 🔥 ADD THESE TWO IMPORTS
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include("Room_Booking.urls")),
    path('api-auth/', include('rest_framework.urls')),
]

# 🔥 ADD THIS BLOCK (VERY IMPORTANT)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)